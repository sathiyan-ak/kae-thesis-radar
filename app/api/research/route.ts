import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateTotalScore, clampScore, recommendationFromScore } from "@/lib/scoring";
import { companies } from "@/lib/companies";
import { thesisById } from "@/lib/thesis";
import type { ResearchEvidence, ScoreBreakdown } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
};

type TavilyResponse = {
  answer?: string;
  results?: TavilyResult[];
};

const keywordMap: Record<string, string[]> = {
  "chronic-pharmacy": ["pharmacy", "medicine", "prescription", "adherence", "chronic", "refill", "pharmacist"],
  "diagnostics-membership": ["diagnostic", "lab", "testing", "preventive", "health check", "membership", "longitudinal"],
  "womens-lifecycle": ["women", "gynaecology", "fertility", "menopause", "maternal", "pcos", "female health"],
  "fertility-chain": ["ivf", "fertility", "embryo", "reproductive", "clinic", "cycle"],
  "pediatric-primary": ["pediatric", "child", "paediatric", "vaccination", "development", "family clinic"],
  "youth-mental-health": ["mental health", "child", "teen", "school", "psychologist", "cbt", "crisis"],
  "ai-home-health": ["home healthcare", "home care", "nurse", "post-operative", "elderly", "route optimisation", "triage"],
  "bharat-vision-dental": ["vision", "optical", "dental", "dentist", "tier 2", "rural", "clinic"],
  telederm: ["dermatology", "skin", "image", "telemedicine", "dermatologist", "triage"],
  "ai-radiology-stack": ["radiology", "medical imaging", "x-ray", "ct", "mri", "radiologist", "diagnostic ai"],
  "ai-pathology": ["pathology", "cancer screening", "slide", "cytology", "histology", "pathologist"],
  "doctor-copilot": ["doctor", "ambient", "scribe", "clinical documentation", "prescription", "speech recognition", "emr"],
  "hospital-rcm": ["hospital", "revenue cycle", "claims", "billing", "denial", "pre-authorisation", "bed management"],
  "pbm-benefits": ["employee benefits", "insurance", "pharmacy benefit", "employer", "care navigation", "corporate health"],
  "precision-oncology": ["genomic", "genome", "oncology", "cancer", "ngs", "tumour", "molecular"],
  "cancer-navigation": ["cancer", "oncology", "care navigation", "tumour board", "care coordinator", "second opinion"],
  "asset-light-specialty": ["specialty clinic", "hospital chain", "clinic chain", "day care", "surgery", "leased"],
  "senior-living": ["senior living", "assisted living", "elder care", "memory care", "geriatric"],
  "respiratory-care": ["respiratory", "asthma", "copd", "allergy", "pulmonology", "spirometry"],
  "remote-monitoring": ["remote patient monitoring", "wearable", "monitoring", "connected device", "vitals", "early warning"],
};

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term));
}

function countTerms(text: string, terms: string[]) {
  return terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
}

function unique(items: string[]) {
  return [...new Set(items)];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const companyName = typeof body.companyName === "string" ? body.companyName.trim() : "";
    const website = typeof body.website === "string" ? body.website.trim() : "";
    const thesisId = typeof body.thesisId === "string" ? body.thesisId : "";
    const opportunity = thesisById[thesisId];

    if (!companyName || !opportunity) {
      return NextResponse.json({ error: "Company name and a valid Kae opportunity are required." }, { status: 400 });
    }

    const apiKey = process.env.TAVILY_API_KEY;
    if (!apiKey) {
      const seed = companies.find((item) => item.name.toLowerCase() === companyName.toLowerCase() || item.slug === companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
      if (!seed) {
        return NextResponse.json({ error: "TAVILY_API_KEY is not configured. Demo mode supports the seeded companies in the pipeline; add a key for any new company." }, { status: 503 });
      }
      return NextResponse.json({
        mode: "seed",
        companyName: seed.name,
        website: seed.website,
        thesisId,
        generatedAt: new Date().toISOString(),
        summary: `${seed.oneLiner} This is a local demonstration screen using the retained seed evidence; configure Tavily to refresh it against the live web.`,
        recommendation: seed.recommendation,
        totalScore: seed.totalScore,
        scores: seed.scores,
        signals: seed.evidence,
        risks: seed.risks,
        diligenceQuestions: seed.diligenceQuestions,
        evidence: seed.sourceUrls.map((url, index) => ({ title: index === 0 ? `${seed.name} primary source` : "Kae public opportunity source", url, content: seed.evidence[index] ?? seed.oneLiner })),
      });
    }

    const domainHint = website ? `Official website: ${website}.` : "";
    const query = [
      `${companyName} India startup company founders product customers partnerships funding traction revenue business model healthcare`,
      `${domainHint}`,
      `Evaluate factual evidence relevant to: ${opportunity.title}.`,
      `Look for official company pages, founder interviews, customer announcements, regulatory validation and credible reporting.`,
    ].join(" ");

    const tavilyResponse = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query,
        search_depth: "advanced",
        topic: "general",
        include_answer: "advanced",
        include_raw_content: false,
        max_results: 10,
        country: "india",
      }),
      cache: "no-store",
    });

    if (!tavilyResponse.ok) {
      const detail = await tavilyResponse.text();
      return NextResponse.json({ error: `Tavily returned ${tavilyResponse.status}: ${detail.slice(0, 240)}` }, { status: 502 });
    }

    const tavily = (await tavilyResponse.json()) as TavilyResponse;
    const evidence: ResearchEvidence[] = (tavily.results ?? [])
      .filter((item): item is Required<Pick<TavilyResult, "title" | "url" | "content">> & TavilyResult => Boolean(item.title && item.url && item.content))
      .map((item) => ({ title: item.title, url: item.url, content: item.content, score: item.score }));

    const corpus = `${tavily.answer ?? ""} ${evidence.map((item) => `${item.title} ${item.content}`).join(" ")}`.toLowerCase();
    const thesisKeywords = keywordMap[thesisId] ?? opportunity.title.toLowerCase().split(/\s+/).filter((word) => word.length > 4);
    const thesisMatches = countTerms(corpus, thesisKeywords);

    const clinicalSignal = includesAny(corpus, ["doctor", "clinician", "medical", "hospital", "healthcare", "radiologist", "pathologist", "oncologist", "pharmacist"]);
    const founderSignal = includesAny(corpus, ["founder", "co-founder", "founded by", "leadership team"]);
    const customerSignal = includesAny(corpus, ["customer", "hospital", "clinic", "partner", "deployed", "used by", "enterprise", "government"]);
    const tractionSignal = includesAny(corpus, ["revenue", "funding", "raised", "series", "growth", "million", "crore", "patients", "doctors", "hospitals"]);
    const validationSignal = includesAny(corpus, ["clinical validation", "peer-reviewed", "study", "trial", "regulatory approval", "fda", "ce mark", "cdsco", "patent"]);
    const aiSignal = includesAny(corpus, ["artificial intelligence", " ai ", "machine learning", "algorithm", "predictive", "computer vision", "large language model"]);
    const softwareSignal = includesAny(corpus, ["software", "saas", "platform", "api", "cloud", "subscription"]);
    const operationalSignal = includesAny(corpus, ["hardware", "device", "clinic", "laboratory", "lab network", "nurse", "home care", "real estate"]);
    const regulatorySignal = includesAny(corpus, ["regulatory", "approval", "clinical", "medical device", "insurance", "patient safety", "privacy"]);

    const scores: ScoreBreakdown = {
      thesisFit: clampScore(46 + thesisMatches * 7 + (website && corpus.includes(website.replace(/^https?:\/\//, "").split("/")[0]) ? 5 : 0)),
      founderMarketFit: clampScore(42 + (founderSignal ? 15 : 0) + (clinicalSignal ? 23 : 0) + (validationSignal ? 8 : 0)),
      marketTiming: clampScore(58 + (aiSignal ? 12 : 0) + (tractionSignal ? 13 : 0) + (regulatorySignal ? 5 : 0)),
      distribution: clampScore(40 + (customerSignal ? 25 : 0) + (tractionSignal ? 16 : 0) + Math.min(evidence.length, 8)),
      defensibility: clampScore(38 + (validationSignal ? 25 : 0) + (clinicalSignal ? 10 : 0) + (aiSignal ? 7 : 0) + (includesAny(corpus, ["proprietary", "patent", "dataset", "workflow integration"]) ? 12 : 0)),
      capitalEfficiency: clampScore(68 + (softwareSignal ? 15 : 0) - (operationalSignal ? 18 : 0) - (includesAny(corpus, ["manufacturing", "clinic chain", "hospital chain"]) ? 10 : 0)),
    };

    const risks = unique([
      evidence.length < 5 ? "The public evidence set is thin; verify the company through primary documents and founder references." : "Public sources may overstate traction; request cohort, customer and financial evidence directly.",
      !founderSignal || !clinicalSignal ? "Founder-market-fit evidence is incomplete, especially domain or clinical depth." : "Founder credentials appear relevant, but operating ownership and team depth still require verification.",
      !customerSignal ? "No strong customer or deployment proof was found in the retrieved sources." : "Named customers or partnerships do not prove recurring production usage or attractive economics.",
      opportunity.regulatory === "High" || regulatorySignal ? "Clinical, privacy or regulatory exposure should be mapped before underwriting growth." : "Regulatory exposure appears manageable but has not been independently verified.",
      operationalSignal ? "Hardware or care-delivery operations may reduce gross margin and increase working-capital needs." : "Software capital efficiency is plausible, but implementation and services intensity remain unknown.",
    ]).slice(0, 5);

    const signals = unique([
      thesisMatches >= 3 ? `Strong semantic overlap with “${opportunity.title}” across retrieved evidence.` : `Some overlap with “${opportunity.title}”, but the wedge needs sharper verification.`,
      clinicalSignal ? "The product appears embedded in a clinical or provider workflow rather than positioned as generic wellness." : "The company has a healthcare angle, but deep clinical workflow evidence was limited.",
      customerSignal ? "Search results contain customer, hospital, partner or deployment signals." : "Distribution evidence is currently limited.",
      tractionSignal ? "Public sources contain funding, scale, usage or growth signals worth validating." : "No clear public traction signal was detected.",
      validationSignal ? "The evidence set references clinical validation, research, patents or regulatory progress." : "Clinical or regulatory validation was not clearly established in the retrieved set.",
    ]).slice(0, 5);

    const totalScore = calculateTotalScore(scores);
    const recommendation = recommendationFromScore(totalScore, risks.filter((risk) => risk.includes("No strong") || risk.includes("thin")).length);
    const summary = (tavily.answer || `${companyName} was screened against Kae’s “${opportunity.title}” opportunity using ${evidence.length} current web sources.`).slice(0, 900);

    const diligenceQuestions = [
      `What is the company’s sharpest wedge inside “${opportunity.title}”, and what will it deliberately not build?`,
      "Which customers are in recurring production use, and what are renewal, utilisation and expansion metrics?",
      "What founder or team capability is genuinely difficult to hire or reproduce?",
      operationalSignal ? "What are gross margin, working-capital requirements and payback after hardware or operations are fully loaded?" : "How much implementation or human service is required to produce each unit of recurring revenue?",
      validationSignal ? "Which clinical or regulatory claims are independently validated, and how is post-deployment performance monitored?" : "What clinical, regulatory or data validation must be completed before the company can safely scale?",
    ];

    return NextResponse.json({
      mode: "live",
      companyName,
      website: website || undefined,
      thesisId,
      generatedAt: new Date().toISOString(),
      summary,
      recommendation,
      totalScore,
      scores,
      signals,
      risks,
      diligenceQuestions,
      evidence,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected research error" }, { status: 500 });
  }
}
