export type Recommendation = "Meet" | "Monitor" | "Pass";

export type ScoreBreakdown = {
  thesisFit: number;
  founderMarketFit: number;
  marketTiming: number;
  distribution: number;
  defensibility: number;
  capitalEfficiency: number;
};

export type ThesisOpportunity = {
  id: string;
  number: number;
  title: string;
  category: string;
  buyer: string;
  model: string;
  founderFit: string;
  whyNow: string;
  watchout: string;
  regulatory: "Low" | "Medium" | "High";
  density: "Crowded" | "Emerging" | "White space";
  sourceUrl: string;
};

export type Company = {
  slug: string;
  name: string;
  website: string;
  oneLiner: string;
  headquarters: string;
  maturity: "Early" | "Scaling" | "Established";
  thesisIds: string[];
  scores: ScoreBreakdown;
  totalScore: number;
  recommendation: Recommendation;
  evidence: string[];
  risks: string[];
  diligenceQuestions: string[];
  sourceUrls: string[];
  lastReviewed: string;
};

export type ResearchEvidence = {
  title: string;
  url: string;
  content: string;
  score?: number;
};

export type ResearchResult = {
  mode?: "live" | "seed";
  companyName: string;
  website?: string;
  thesisId: string;
  generatedAt: string;
  summary: string;
  recommendation: Recommendation;
  totalScore: number;
  scores: ScoreBreakdown;
  signals: string[];
  risks: string[];
  diligenceQuestions: string[];
  evidence: ResearchEvidence[];
};
