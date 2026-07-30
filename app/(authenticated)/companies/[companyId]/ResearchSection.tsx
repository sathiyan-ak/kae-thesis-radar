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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleStartResearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/research/enqueue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          thesisOpportunityId,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `Failed to enqueue research (${response.status})`);
      }

      const { runId } = await response.json();
      router.push(`/app/research/${runId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Research History</h2>
        <button
          onClick={handleStartResearch}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-400 transition-colors"
        >
          {loading ? "Starting..." : "Start Research"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

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
