"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ResearchRun {
  id: string;
  status: string;
  total_score: number;
  completed_at: string;
}

interface ResearchSectionProps {
  companyId: string;
  thesisOpportunityId: string | null;
  runs: ResearchRun[];
}

export default function ResearchSection({
  companyId,
  thesisOpportunityId,
  runs,
}: ResearchSectionProps) {
  const router = useRouter();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Research History</h2>
      </div>

      <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <button
          disabled={true}
          title="Live research unavailable in demonstration"
          className="px-4 py-2 bg-slate-400 text-white rounded-lg font-medium cursor-not-allowed"
        >
          Live Research Unavailable
        </button>
        <p className="text-sm text-slate-600 mt-3">
          Live research unavailable in this demonstration. Seeded evidence screens remain available for review.
        </p>
      </div>

      {runs && runs.length > 0 ? (
        <div className="space-y-2">
          {runs.map(
            (run: ResearchRun) => (
              <a
                key={run.id}
                href={`/app/research/${run.id}`}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-slate-900">Run {run.id.substring(0, 8)}</p>
                  <p className="text-sm text-slate-600">{run.status}</p>
                </div>
                {run.total_score && (
                  <p className="text-2xl font-bold text-slate-900">{run.total_score.toFixed(0)}</p>
                )}
              </a>
            )
          )}
        </div>
      ) : (
        <p className="text-slate-600">No research runs yet</p>
      )}
    </section>
  );
}
