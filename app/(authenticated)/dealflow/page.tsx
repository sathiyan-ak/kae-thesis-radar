import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DealflowPage() {
  const supabase = await createClient();

  const { data: companies } = await supabase
    .from("companies")
    .select(
      `
      id, canonical_name, status, founded_year,
      thesis_opportunities(title),
      research_runs(id, status, completed_at, total_score)
    `
    )
    .limit(50);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dealflow</h1>
        <p className="mt-2 text-slate-600">Tracked companies and research status</p>
      </div>

      {!companies || companies.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <p className="text-slate-600">
            No companies yet. Add your first by clicking "New Screen" above.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Thesis
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                    Last Run
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {companies.map((company: any) => {
                  const latestRun = company.research_runs?.[0];
                  return (
                    <tr key={company.id} className="hover:bg-slate-50">
                      <td className="px-6 py-3">
                        <Link href={`/app/companies/${company.id}`} className="text-blue-600 hover:underline">
                          {company.canonical_name}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {company.thesis_opportunities?.title || "—"}
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {company.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-slate-900">
                        {latestRun?.total_score ? latestRun.total_score.toFixed(0) : "—"}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {latestRun?.completed_at
                          ? new Date(latestRun.completed_at).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
