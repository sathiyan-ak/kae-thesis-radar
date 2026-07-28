import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleAlert, ExternalLink, HelpCircle, ShieldCheck } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { companyBySlug } from "@/lib/companies";
import { thesisById } from "@/lib/thesis";

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const company = companyBySlug[slug];
  if (!company) notFound();

  const scoreEntries = Object.entries(company.scores);
  const recommendationTone = company.recommendation === "Meet" ? "text-emerald-100 bg-emerald-200/10 border-emerald-200/20" : company.recommendation === "Monitor" ? "text-amber-100 bg-amber-200/10 border-amber-200/20" : "text-red-100 bg-red-200/10 border-red-200/20";

  return (
    <main className="grid-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="no-print mb-5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to radar</Link>
          <PrintButton />
        </div>

        <section className="glass rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col gap-6 border-b border-white/[0.07] pb-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${recommendationTone}`}>{company.recommendation}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">{company.maturity}</span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-400">Reviewed {company.lastReviewed}</span>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">{company.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">{company.oneLiner}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {company.thesisIds.map((id) => {
                  const opportunity = thesisById[id];
                  return <span key={id} className="rounded-full border border-emerald-200/15 bg-emerald-200/[0.05] px-3 py-1.5 text-xs text-emerald-100">#{opportunity?.number} {opportunity?.title ?? id}</span>;
                })}
              </div>
            </div>
            <div className="flex min-w-40 flex-col items-start rounded-2xl border border-emerald-200/10 bg-emerald-200/[0.04] p-5 lg:items-end">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">First-pass score</p>
              <p className="mt-2 text-5xl font-semibold tracking-tight text-emerald-100">{company.totalScore}<span className="text-base font-normal text-zinc-600">/100</span></p>
              <a href={company.website} target="_blank" rel="noreferrer" className="no-print mt-4 inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-white">Company website <ExternalLink className="h-3.5 w-3.5" /></a>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scoreEntries.map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-white/[0.07] bg-white/[0.022] p-4">
                <div className="flex items-center justify-between text-xs"><span className="capitalize text-zinc-500">{key.replace(/([A-Z])/g, " $1")}</span><span className="font-mono text-zinc-200">{value}/100</span></div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]"><div className="h-full rounded-full bg-emerald-200" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <section>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-200" /><h2 className="text-sm font-medium text-white">Investment-positive evidence</h2></div>
              <div className="mt-4 space-y-3">
                {company.evidence.map((item) => <div key={item} className="rounded-xl border border-emerald-200/10 bg-emerald-200/[0.035] p-4 text-sm leading-6 text-emerald-50/75">{item}</div>)}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-2"><CircleAlert className="h-5 w-5 text-red-200" /><h2 className="text-sm font-medium text-white">Bear case and unresolved risk</h2></div>
              <div className="mt-4 space-y-3">
                {company.risks.map((item) => <div key={item} className="rounded-xl border border-red-200/10 bg-red-200/[0.03] p-4 text-sm leading-6 text-red-50/70">{item}</div>)}
              </div>
            </section>
          </div>

          <section className="mt-8 rounded-2xl border border-white/[0.07] bg-black/10 p-5 sm:p-6">
            <div className="flex items-center gap-2"><HelpCircle className="h-5 w-5 text-emerald-200" /><h2 className="text-sm font-medium text-white">Five questions before the meeting</h2></div>
            <ol className="mt-5 grid gap-3 lg:grid-cols-2">
              {company.diligenceQuestions.map((item, index) => (
                <li key={item} className="flex gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-6 text-zinc-300"><span className="font-mono text-xs text-emerald-200">{String(index + 1).padStart(2, "0")}</span><span>{item}</span></li>
              ))}
            </ol>
          </section>

          <section className="mt-8">
            <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-200" /><h2 className="text-sm font-medium text-white">Sources retained</h2></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {company.sourceUrls.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="no-print flex items-center justify-between gap-3 rounded-xl border border-white/[0.07] p-4 text-xs text-zinc-400 transition hover:border-emerald-200/20 hover:text-white"><span className="truncate">{url}</span><ExternalLink className="h-3.5 w-3.5 shrink-0" /></a>)}
            </div>
          </section>

          <div className="mt-8 border-t border-white/[0.07] pt-5 text-[11px] leading-5 text-zinc-600">
            Independent research work sample. The score is a structured first-pass assessment, not an investment recommendation. Current primary-source verification is required before any real investment decision.
          </div>
        </section>
      </div>
    </main>
  );
}
