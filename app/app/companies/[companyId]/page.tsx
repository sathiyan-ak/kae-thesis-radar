import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ResearchSection from "./ResearchSection";

export default async function CompanyDetailPage(props: {
  params: Promise<{ companyId: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  const { data: company } = await supabase
    .from("companies")
    .select(
      `
      id, canonical_name, domain, description, headquarters, founded_year,
      thesis_opportunities(id, title),
      research_runs(id, status, total_score, completed_at),
      analyst_notes(body, author_id, created_at)
    `
    )
    .eq("id", params.companyId)
    .single();

  if (!company) notFound();

  return (
    <div className="p-8 max-w-6xl">
      <a
        href="/app/companies"
        className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center gap-1"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Companies
      </a>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{company.canonical_name}</h1>
        <p className="text-slate-600 mt-2">{company.description}</p>
        {company.domain && (
          <a href={`https://${company.domain}`} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
            {company.domain}
          </a>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Founded</p>
          <p className="text-xl font-bold text-slate-900">{company.founded_year || "—"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Headquarters</p>
          <p className="text-sm font-medium text-slate-900">{company.headquarters || "—"}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Thesis</p>
          <p className="text-sm font-medium text-slate-900">
            {company.thesis_opportunities ? (
              Array.isArray(company.thesis_opportunities)
                ? company.thesis_opportunities[0]?.title
                : (company.thesis_opportunities as any)?.title
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Research runs */}
        <ResearchSection
          companyId={params.companyId}
          thesisOpportunityId={company.thesis_opportunities ? (Array.isArray(company.thesis_opportunities) ? company.thesis_opportunities[0]?.id : (company.thesis_opportunities as any)?.id) : null}
          runs={company.research_runs || []}
        />

        {/* Analyst notes */}
        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Analyst Notes</h2>
          {company.analyst_notes && company.analyst_notes.length > 0 ? (
            <div className="space-y-4">
              {company.analyst_notes.map((note: { body: string; created_at: string }) => (
                <div key={note.created_at} className="p-4 border border-slate-200 rounded-lg">
                  <p className="text-slate-900">{note.body}</p>
                  <p className="text-xs text-slate-500 mt-2">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600">No notes yet</p>
          )}
        </section>
      </div>
    </div>
  );
}
