"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Database,
  ExternalLink,
  FileSearch,
  Filter,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Info,
  Layers3,
  LoaderCircle,
  Menu,
  Radar,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Company, ResearchResult, ThesisOpportunity } from "@/lib/types";
import { SCORE_WEIGHTS } from "@/lib/scoring";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "thesis", label: "Thesis map", icon: Radar },
  { id: "pipeline", label: "Startup pipeline", icon: Building2 },
  { id: "screen", label: "Live screen", icon: FileSearch },
  { id: "methodology", label: "Methodology", icon: BookOpenCheck },
] as const;

type TabId = (typeof tabs)[number]["id"];

type Props = {
  companies: Company[];
  thesis: ThesisOpportunity[];
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "green" | "amber" | "red" | "neutral" | "blue" }) {
  const tones = {
    green: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
    amber: "border-amber-300/20 bg-amber-300/10 text-amber-100",
    red: "border-red-300/20 bg-red-300/10 text-red-100",
    neutral: "border-white/10 bg-white/[0.04] text-zinc-300",
    blue: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  };
  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium", tones[tone])}>{children}</span>;
}

function RecommendationBadge({ recommendation }: { recommendation: Company["recommendation"] | ResearchResult["recommendation"] }) {
  return <Badge tone={recommendation === "Meet" ? "green" : recommendation === "Monitor" ? "amber" : "red"}>{recommendation}</Badge>;
}

function ScoreRing({ value, size = "md" }: { value: number; size?: "sm" | "md" | "lg" }) {
  const dimension = size === "lg" ? 104 : size === "md" ? 72 : 48;
  const radius = dimension / 2 - 7;
  const circumference = 2 * Math.PI * radius;
  const dash = (value / 100) * circumference;
  return (
    <div className="relative shrink-0" style={{ width: dimension, height: dimension }}>
      <svg className="-rotate-90" width={dimension} height={dimension} viewBox={`0 0 ${dimension} ${dimension}`}>
        <circle cx={dimension / 2} cy={dimension / 2} r={radius} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="6" />
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b7f7cf" />
            <stop offset="100%" stopColor="#52d991" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cx("font-semibold tracking-tight", size === "lg" ? "text-2xl" : size === "md" ? "text-lg" : "text-sm")}>{value}</span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, helper }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; helper: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
        </div>
        <div className="rounded-xl border border-emerald-200/10 bg-emerald-200/[0.07] p-2.5 text-emerald-100">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-zinc-500">{helper}</p>
    </div>
  );
}

export function Dashboard({ companies, thesis }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [query, setQuery] = useState("");
  const [recommendation, setRecommendation] = useState("All");
  const [density, setDensity] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredCompanies = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((company) => {
      const matchesQuery = !q || [company.name, company.oneLiner, company.headquarters].some((value) => value.toLowerCase().includes(q));
      const matchesRecommendation = recommendation === "All" || company.recommendation === recommendation;
      return matchesQuery && matchesRecommendation;
    });
  }, [companies, query, recommendation]);

  const meetCount = companies.filter((c) => c.recommendation === "Meet").length;
  const monitorCount = companies.filter((c) => c.recommendation === "Monitor").length;
  const whiteSpaceCount = thesis.filter((item) => item.density === "White space").length;
  const averageScore = Math.round(companies.reduce((sum, item) => sum + item.totalScore, 0) / companies.length);

  const switchTab = (id: TabId) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="grid-bg min-h-screen">
      <header className="no-print sticky top-0 z-40 border-b border-white/[0.06] bg-[#07110d]/88 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200/15 bg-emerald-200/10">
              <Radar className="h-5 w-5 text-emerald-100" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-tight text-white">Kae Thesis Radar</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Healthtech sourcing system</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Badge tone="green"><span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-300" />Evidence mode</Badge>
            <a
              href="https://kae-capital.com/blog/what-to-build-healthtech/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs text-zinc-300 transition hover:border-emerald-200/25 hover:text-white"
            >
              Public thesis <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <button className="rounded-lg border border-white/10 p-2 md:hidden" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Open navigation">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <aside className={cx("no-print fixed inset-x-4 top-20 z-30 rounded-2xl p-2 md:sticky md:top-22 md:block md:h-[calc(100vh-7.5rem)] md:w-56 md:shrink-0 md:bg-transparent md:p-0", mobileMenuOpen ? "glass block" : "hidden")}>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={cx(
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm transition",
                    active ? "border border-emerald-200/15 bg-emerald-200/[0.09] text-emerald-50" : "border border-transparent text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200",
                  )}
                >
                  <span className="flex items-center gap-3"><Icon className="h-4 w-4" />{tab.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />}
                </button>
              );
            })}
          </nav>
          <div className="mt-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
              <Database className="h-4 w-4 text-emerald-200" /> Data status
            </div>
            <div className="mt-4 space-y-3 text-xs text-zinc-500">
              <div className="flex justify-between"><span>Thesis areas</span><span className="text-zinc-300">20 / 20</span></div>
              <div className="flex justify-between"><span>Seed screens</span><span className="text-zinc-300">{companies.length}</span></div>
              <div className="flex justify-between"><span>Live research</span><span className="text-amber-200">API key</span></div>
            </div>
          </div>
          <div className="mt-auto hidden pt-6 text-[11px] leading-5 text-zinc-600 md:block">
            Independent work sample. Not affiliated with or endorsed by Kae Capital.
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          {activeTab === "overview" && (
            <Overview
              companies={companies}
              thesis={thesis}
              meetCount={meetCount}
              monitorCount={monitorCount}
              whiteSpaceCount={whiteSpaceCount}
              averageScore={averageScore}
              onNavigate={switchTab}
            />
          )}
          {activeTab === "thesis" && <ThesisMap thesis={thesis} density={density} setDensity={setDensity} />}
          {activeTab === "pipeline" && (
            <Pipeline
              companies={filteredCompanies}
              query={query}
              setQuery={setQuery}
              recommendation={recommendation}
              setRecommendation={setRecommendation}
            />
          )}
          {activeTab === "screen" && <LiveScreen thesis={thesis} />}
          {activeTab === "methodology" && <Methodology />}
        </section>
      </div>
    </main>
  );
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
      <div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-200/70">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Overview({
  companies,
  thesis,
  meetCount,
  monitorCount,
  whiteSpaceCount,
  averageScore,
  onNavigate,
}: {
  companies: Company[];
  thesis: ThesisOpportunity[];
  meetCount: number;
  monitorCount: number;
  whiteSpaceCount: number;
  averageScore: number;
  onNavigate: (id: TabId) => void;
}) {
  const topCompanies = [...companies].sort((a, b) => b.totalScore - a.totalScore).slice(0, 5);
  const whiteSpaces = thesis.filter((item) => item.density === "White space").slice(0, 5);
  return (
    <>
      <PageHeader
        eyebrow="Analyst command centre"
        title="From public thesis to repeatable deal screens."
        description="Map Kae’s 20 healthtech opportunities, identify under-built areas, screen companies with a transparent rubric, and generate evidence-backed diligence questions."
        action={
          <button onClick={() => onNavigate("screen")} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-200 px-4 py-2.5 text-sm font-semibold text-[#082017] transition hover:bg-emerald-100">
            <Sparkles className="h-4 w-4" /> Screen a startup
          </button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard icon={Target} label="Opportunity areas" value={thesis.length} helper="Structured from Kae’s July 2026 public healthtech thought piece." />
        <MetricCard icon={Building2} label="Companies screened" value={companies.length} helper="Evidence-led seed records designed to be refreshed through Tavily." />
        <MetricCard icon={CheckCircle2} label="Meet candidates" value={meetCount} helper={`${monitorCount} additional companies currently fall into Monitor.`} />
        <MetricCard icon={Radar} label="White spaces" value={whiteSpaceCount} helper={`Portfolio-wide average first-pass score: ${averageScore}/100.`} />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.9fr]">
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Highest-priority screens</p>
              <p className="mt-1 text-xs text-zinc-500">Ranked by transparent weighted score, not an LLM opinion.</p>
            </div>
            <button onClick={() => onNavigate("pipeline")} className="text-xs text-emerald-200 hover:text-emerald-100">View pipeline</button>
          </div>
          <div className="mt-5 overflow-x-auto custom-scrollbar">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                  <th className="pb-3 font-medium">Company</th>
                  <th className="pb-3 font-medium">Primary fit</th>
                  <th className="pb-3 font-medium">Score</th>
                  <th className="pb-3 font-medium">Decision</th>
                  <th className="pb-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {topCompanies.map((company) => (
                  <tr key={company.slug} className="border-b border-white/[0.05] last:border-0">
                    <td className="py-4">
                      <p className="text-sm font-medium text-white">{company.name}</p>
                      <p className="mt-1 max-w-xs truncate text-xs text-zinc-600">{company.oneLiner}</p>
                    </td>
                    <td className="py-4 text-xs text-zinc-400">{company.thesisIds[0].replaceAll("-", " ")}</td>
                    <td className="py-4"><span className="font-mono text-sm text-emerald-100">{company.totalScore}</span></td>
                    <td className="py-4"><RecommendationBadge recommendation={company.recommendation} /></td>
                    <td className="py-4 text-right">
                      <Link href={`/company/${company.slug}`} className="inline-flex rounded-lg border border-white/10 p-2 text-zinc-500 transition hover:text-white" aria-label={`Open ${company.name}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Potential white spaces</p>
              <p className="mt-1 text-xs text-zinc-500">Initial density labels for research prioritisation.</p>
            </div>
            <Radar className="h-5 w-5 text-emerald-200" />
          </div>
          <div className="mt-5 space-y-3">
            {whiteSpaces.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{item.number}. {item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-600">{item.buyer}</p>
                  </div>
                  <Badge tone="green">White space</Badge>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate("thesis")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-xs text-zinc-400 transition hover:border-emerald-200/20 hover:text-white">
            Explore all 20 areas <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200/10 bg-amber-200/[0.04] p-4 text-xs leading-5 text-amber-100/70">
        <div className="flex gap-3"><Info className="mt-0.5 h-4 w-4 shrink-0" /><p>Seed scores are a work-sample demonstration, not investment recommendations. Refresh every company with current primary-source evidence before using the output in a real decision.</p></div>
      </div>
    </>
  );
}

function ThesisMap({ thesis, density, setDensity }: { thesis: ThesisOpportunity[]; density: string; setDensity: (value: string) => void }) {
  const visible = density === "All" ? thesis : thesis.filter((item) => item.density === density);
  return (
    <>
      <PageHeader
        eyebrow="Opportunity architecture"
        title="Twenty ideas, converted into investable research fields."
        description="Each card separates customer, business model, founder-market fit, regulation, timing and the failure mode an analyst should pressure-test."
        action={
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.025] p-1">
            {['All', 'White space', 'Emerging', 'Crowded'].map((item) => (
              <button key={item} onClick={() => setDensity(item)} className={cx("rounded-lg px-3 py-2 text-xs transition", density === item ? "bg-white/10 text-white" : "text-zinc-600 hover:text-zinc-300")}>{item}</button>
            ))}
          </div>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {visible.map((item) => (
          <article key={item.id} className="glass group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-emerald-200/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200/10 bg-emerald-200/[0.06] font-mono text-sm text-emerald-100">{String(item.number).padStart(2, '0')}</div>
              <div className="flex gap-2"><Badge tone={item.density === "White space" ? "green" : item.density === "Crowded" ? "red" : "amber"}>{item.density}</Badge><Badge>{item.regulatory} reg.</Badge></div>
            </div>
            <h2 className="mt-5 text-lg font-semibold tracking-tight text-white">{item.title}</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-zinc-600">{item.category}</p>
            <div className="mt-5 space-y-4 text-xs leading-5">
              <div><p className="text-zinc-600">Buyer</p><p className="mt-1 text-zinc-300">{item.buyer}</p></div>
              <div><p className="text-zinc-600">Business model</p><p className="mt-1 text-zinc-300">{item.model}</p></div>
              <div><p className="text-zinc-600">Who wins</p><p className="mt-1 text-zinc-300">{item.founderFit}</p></div>
              <div className="rounded-xl border border-emerald-200/10 bg-emerald-200/[0.04] p-3"><p className="text-emerald-200/60">Why now</p><p className="mt-1 text-emerald-50/80">{item.whyNow}</p></div>
              <div className="rounded-xl border border-red-200/10 bg-red-200/[0.03] p-3"><p className="text-red-200/60">Watch-out</p><p className="mt-1 text-red-50/70">{item.watchout}</p></div>
            </div>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs text-zinc-600 transition group-hover:text-emerald-200">Source paragraph <ExternalLink className="h-3.5 w-3.5" /></a>
          </article>
        ))}
      </div>
    </>
  );
}

function Pipeline({ companies, query, setQuery, recommendation, setRecommendation }: { companies: Company[]; query: string; setQuery: (value: string) => void; recommendation: string; setRecommendation: (value: string) => void }) {
  return (
    <>
      <PageHeader
        eyebrow="Deal-flow screen"
        title="A pipeline that explains its judgement."
        description="Filter candidates, inspect evidence and risks, then open a complete first-pass screen with diligence questions and source links."
      />
      <div className="glass mb-4 flex flex-col gap-3 rounded-2xl p-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search company or thesis fit" className="w-full rounded-xl border border-white/[0.07] bg-black/10 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-200/25" />
        </label>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="ml-1 h-4 w-4 shrink-0 text-zinc-600" />
          {['All', 'Meet', 'Monitor', 'Pass'].map((item) => (
            <button key={item} onClick={() => setRecommendation(item)} className={cx("rounded-xl border px-3 py-2 text-xs transition", recommendation === item ? "border-emerald-200/20 bg-emerald-200/[0.08] text-emerald-50" : "border-white/[0.06] text-zinc-600 hover:text-zinc-300")}>{item}</button>
          ))}
        </div>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full min-w-[960px] text-left">
            <thead>
              <tr className="border-b border-white/[0.07] bg-white/[0.02] text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                <th className="px-5 py-4 font-medium">Company</th>
                <th className="px-5 py-4 font-medium">Thesis fit</th>
                <th className="px-5 py-4 font-medium">Maturity</th>
                <th className="px-5 py-4 font-medium">Score</th>
                <th className="px-5 py-4 font-medium">Decision</th>
                <th className="px-5 py-4 font-medium">Primary risk</th>
                <th className="px-5 py-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.slug} className="border-b border-white/[0.05] transition last:border-0 hover:bg-white/[0.018]">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-white">{company.name}</p>
                    <p className="mt-1 max-w-[280px] truncate text-xs text-zinc-600">{company.oneLiner}</p>
                  </td>
                  <td className="px-5 py-4"><div className="flex max-w-[260px] flex-wrap gap-1.5">{company.thesisIds.slice(0, 2).map((id) => <Badge key={id}>{id.replaceAll('-', ' ')}</Badge>)}</div></td>
                  <td className="px-5 py-4 text-xs text-zinc-400">{company.maturity}</td>
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><ScoreRing value={company.totalScore} size="sm" /><span className="text-xs text-zinc-600">/100</span></div></td>
                  <td className="px-5 py-4"><RecommendationBadge recommendation={company.recommendation} /></td>
                  <td className="max-w-xs px-5 py-4 text-xs leading-5 text-zinc-500">{company.risks[0]}</td>
                  <td className="px-5 py-4 text-right"><Link href={`/company/${company.slug}`} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-emerald-200/20 hover:text-white">Open <ChevronRight className="h-3.5 w-3.5" /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {companies.length === 0 && <div className="p-12 text-center text-sm text-zinc-600">No companies match these filters.</div>}
      </div>
    </>
  );
}

function LiveScreen({ thesis }: { thesis: ThesisOpportunity[] }) {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [thesisId, setThesisId] = useState(thesis[11].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);

  async function runResearch(event: React.FormEvent) {
    event.preventDefault();
    if (!companyName.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName: companyName.trim(), website: website.trim(), thesisId }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Research request failed");
      setResult(payload);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Research request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Repeatable research workflow"
        title="Turn a company name into a first-pass diligence screen."
        description="Tavily gathers current web evidence. A deterministic signal layer scores the company against a selected Kae opportunity and shows every source used."
      />
      <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={runResearch} className="glass h-fit rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-emerald-200/10 bg-emerald-200/[0.07] p-2.5"><FlaskConical className="h-5 w-5 text-emerald-100" /></div>
            <div><p className="text-sm font-medium text-white">New company screen</p><p className="mt-1 text-xs text-zinc-600">Runs live when TAVILY_API_KEY is configured.</p></div>
          </div>
          <div className="mt-6 space-y-4">
            <label className="block"><span className="text-xs text-zinc-500">Company name</span><input required value={companyName} onChange={(event) => setCompanyName(event.target.value)} placeholder="e.g. Augnito" className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/10 px-3.5 py-3 text-sm outline-none placeholder:text-zinc-700 focus:border-emerald-200/25" /></label>
            <label className="block"><span className="text-xs text-zinc-500">Website <span className="text-zinc-700">(optional)</span></span><input value={website} onChange={(event) => setWebsite(event.target.value)} placeholder="https://company.com" className="mt-2 w-full rounded-xl border border-white/[0.08] bg-black/10 px-3.5 py-3 text-sm outline-none placeholder:text-zinc-700 focus:border-emerald-200/25" /></label>
            <label className="block"><span className="text-xs text-zinc-500">Kae opportunity</span><select value={thesisId} onChange={(event) => setThesisId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/[0.08] bg-[#0d1b15] px-3.5 py-3 text-sm text-zinc-300 outline-none focus:border-emerald-200/25">{thesis.map((item) => <option key={item.id} value={item.id}>{item.number}. {item.title}</option>)}</select></label>
          </div>
          <button disabled={loading || !companyName.trim()} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-200 px-4 py-3 text-sm font-semibold text-[#082017] transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}{loading ? "Researching sources" : "Run evidence screen"}
          </button>
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[11px] leading-5 text-zinc-600">
            The system deliberately avoids estimating revenue, valuation or market size without evidence. Missing facts become diligence questions.
          </div>
        </form>

        <div className="glass min-h-[520px] rounded-2xl p-5 sm:p-6">
          {!result && !error && !loading && (
            <div className="flex min-h-[470px] flex-col items-center justify-center text-center">
              <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4"><FileSearch className="h-7 w-7 text-zinc-500" /></div>
              <p className="mt-5 text-sm font-medium text-zinc-300">Your evidence-backed screen appears here</p>
              <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-600">Add a Tavily API key to search current company, founder, funding, product, customer and regulatory evidence.</p>
            </div>
          )}
          {loading && (
            <div className="flex min-h-[470px] flex-col items-center justify-center text-center">
              <LoaderCircle className="h-8 w-8 animate-spin text-emerald-200" />
              <p className="mt-4 text-sm text-zinc-300">Collecting and scoring evidence</p>
              <p className="mt-2 text-xs text-zinc-600">Looking for product, team, distribution, traction and risk signals.</p>
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-200/10 bg-red-200/[0.04] p-5">
              <div className="flex items-start gap-3"><CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-200" /><div><p className="text-sm font-medium text-red-100">Research could not run</p><p className="mt-2 text-xs leading-5 text-red-100/60">{error}</p></div></div>
              <div className="mt-4 rounded-xl border border-white/[0.06] bg-black/10 p-3 font-mono text-[11px] text-zinc-500">TAVILY_API_KEY=tvly-your-key</div>
            </div>
          )}
          {result && <ResearchOutput result={result} />}
        </div>
      </div>
    </>
  );
}

function ResearchOutput({ result }: { result: ResearchResult }) {
  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="flex items-center gap-2"><Badge tone="blue">{result.mode === "seed" ? "Seed demo" : "Live evidence"}</Badge><RecommendationBadge recommendation={result.recommendation} /></div><h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">{result.companyName}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{result.summary}</p></div>
        <ScoreRing value={result.totalScore} size="lg" />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(result.scores).map(([key, value]) => (
          <div key={key} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="flex items-center justify-between text-xs"><span className="capitalize text-zinc-500">{key.replace(/([A-Z])/g, ' $1')}</span><span className="font-mono text-zinc-200">{value}</span></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-emerald-200" style={{ width: `${value}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">Positive signals</p><div className="mt-3 space-y-2">{result.signals.map((item) => <div key={item} className="flex gap-2 rounded-xl border border-emerald-200/10 bg-emerald-200/[0.035] p-3 text-xs leading-5 text-emerald-50/75"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200" />{item}</div>)}</div></div>
        <div><p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">Risks / missing evidence</p><div className="mt-3 space-y-2">{result.risks.map((item) => <div key={item} className="flex gap-2 rounded-xl border border-red-200/10 bg-red-200/[0.03] p-3 text-xs leading-5 text-red-50/70"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-200" />{item}</div>)}</div></div>
      </div>
      <div className="mt-5"><p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">Diligence questions</p><ol className="mt-3 space-y-2">{result.diligenceQuestions.map((item, index) => <li key={item} className="flex gap-3 rounded-xl border border-white/[0.06] p-3 text-xs leading-5 text-zinc-300"><span className="font-mono text-emerald-200">{String(index + 1).padStart(2, '0')}</span>{item}</li>)}</ol></div>
      <div className="mt-5"><p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">Evidence used</p><div className="mt-3 space-y-2">{result.evidence.slice(0, 6).map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block rounded-xl border border-white/[0.06] p-3 transition hover:border-emerald-200/20"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-zinc-300">{source.title}</p><p className="mt-1 line-clamp-2 text-[11px] leading-5 text-zinc-600">{source.content}</p></div><ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-600" /></div></a>)}</div></div>
    </div>
  );
}

function Methodology() {
  const weights = Object.entries(SCORE_WEIGHTS);
  return (
    <>
      <PageHeader
        eyebrow="Auditable judgement"
        title="A scoring system the investment team can challenge."
        description="The score is not designed to replace investment judgement. It forces the analyst to separate evidence, assumptions and missing information before recommending a meeting."
      />
      <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-3"><Gauge className="h-5 w-5 text-emerald-200" /><p className="text-sm font-medium text-white">Weighted score</p></div>
          <div className="mt-6 space-y-5">
            {weights.map(([key, weight]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs"><span className="capitalize text-zinc-300">{key.replace(/([A-Z])/g, ' $1')}</span><span className="font-mono text-zinc-500">{Math.round(weight * 100)}%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]"><div className="h-full rounded-full bg-emerald-200/70" style={{ width: `${weight * 100 * 3.2}%` }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-white/[0.06] bg-black/10 p-4 font-mono text-xs leading-6 text-zinc-500">Total = Σ(axis score × disclosed weight)<br />Meet ≥ 76 · Monitor ≥ 58 · Pass &lt; 58</div>
        </div>
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5 sm:p-6"><div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-emerald-200" /><p className="text-sm font-medium text-white">Research guardrails</p></div><div className="mt-5 space-y-3 text-xs leading-5 text-zinc-500">{[
            "Every factual claim must retain a clickable source.",
            "Unknown financials remain unknown; the tool does not fabricate estimates.",
            "Primary sources outrank databases, press and search summaries.",
            "A strong score with high clinical or regulatory risk cannot bypass human review.",
            "The analyst can override a decision, but must write the reason.",
          ].map((item) => <div key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/60" /><span>{item}</span></div>)}</div></div>
          <div className="glass rounded-2xl p-5 sm:p-6"><div className="flex items-center gap-3"><GitCompareArrows className="h-5 w-5 text-emerald-200" /><p className="text-sm font-medium text-white">Recommended analyst loop</p></div><ol className="mt-5 space-y-4">{[
            ["01", "Source", "Find companies against a specific opportunity, not a generic sector."],
            ["02", "Verify", "Read the company site, founder profiles, filings and customer evidence."],
            ["03", "Score", "Separate thesis fit from distribution, defensibility and capital intensity."],
            ["04", "Challenge", "Write the bear case and five questions before recommending a meeting."],
            ["05", "Refresh", "Re-run the screen when new funding, product or regulatory evidence appears."],
          ].map(([number, title, text]) => <li key={number} className="flex gap-4"><span className="font-mono text-xs text-emerald-200">{number}</span><div><p className="text-xs font-medium text-zinc-300">{title}</p><p className="mt-1 text-xs leading-5 text-zinc-600">{text}</p></div></li>)}</ol></div>
        </div>
      </div>
      <div className="mt-5 glass rounded-2xl p-5 sm:p-6"><div className="flex items-center gap-3"><Layers3 className="h-5 w-5 text-emerald-200" /><p className="text-sm font-medium text-white">What this MVP proves</p></div><div className="mt-5 grid gap-3 md:grid-cols-3">{[
        ["Research judgement", "The public thesis is converted into structured, falsifiable investment questions."],
        ["Product judgement", "The workflow optimises for analyst decisions rather than a decorative dashboard."],
        ["Execution", "The app can run with local seed data, Tavily live research and optional Supabase persistence."],
      ].map(([title, text]) => <div key={title} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"><p className="text-xs font-medium text-zinc-300">{title}</p><p className="mt-2 text-xs leading-5 text-zinc-600">{text}</p></div>)}</div></div>
    </>
  );
}
