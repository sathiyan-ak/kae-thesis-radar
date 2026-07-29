"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Loader } from "lucide-react";

interface ResearchRunStatus {
  id: string;
  status: string;
  progress: number;
  companies: { canonical_name: string };
  thesis_opportunities: { title: string } | null;
  provider_runs: Array<{
    provider: string;
    status: string;
    latency_ms: number | null;
    completed_at: string | null;
  }>;
}

export default function ResearchRunPage(props: {
  params: Promise<{ runId: string }>;
}) {
  const [runId, setRunId] = useState<string | null>(null);
  const [run, setRun] = useState<ResearchRunStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    props.params.then((p) => setRunId(p.runId));
  }, [props.params]);

  useEffect(() => {
    if (!runId) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/research/${runId}/progress`);
        if (!res.ok) throw new Error("Failed to fetch progress");
        const data = await res.json();
        setRun(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 2000);
    return () => clearInterval(interval);
  }, [runId]);

  if (!runId || loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <a href="/app/dealflow" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Dealflow
        </a>
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-lg font-semibold text-red-900">Error</h2>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!run) return null;

  const statusColors: Record<string, string> = {
    queued: "bg-slate-100 text-slate-700",
    running: "bg-blue-100 text-blue-700",
    review_required: "bg-amber-100 text-amber-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    running: <Loader className="h-4 w-4 animate-spin" />,
    completed: <CheckCircle2 className="h-4 w-4" />,
    failed: <AlertCircle className="h-4 w-4" />,
  };

  return (
    <div className="p-8">
      <a href="/app/dealflow" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
        ← Back to Dealflow
      </a>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{run.companies.canonical_name}</h1>
        {run.thesis_opportunities && (
          <p className="text-slate-600 mt-2">{run.thesis_opportunities.title}</p>
        )}
      </div>

      <div className="space-y-8">
        {/* Status */}
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Status</h2>
              <div className={`inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg font-medium ${statusColors[run.status] || statusColors.queued}`}>
                {statusIcons[run.status]}
                {run.status.replace("_", " ").toUpperCase()}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-600">Progress</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{run.progress}%</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${run.progress}%` }}
            />
          </div>
        </div>

        {/* Provider runs */}
        <div className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Research Stages</h2>
          <div className="space-y-2">
            {run.provider_runs && run.provider_runs.length > 0 ? (
              run.provider_runs.map((pr, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{pr.provider}</p>
                    <p className="text-sm text-slate-600">
                      {pr.status === "completed" && `Completed in ${pr.latency_ms}ms`}
                      {pr.status === "running" && "Running..."}
                      {pr.status === "pending" && "Pending"}
                      {pr.status === "failed" && "Failed"}
                      {pr.status === "skipped" && "Skipped"}
                    </p>
                  </div>
                  <div>
                    {pr.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                    {pr.status === "running" && <Loader className="h-5 w-5 animate-spin text-blue-600" />}
                    {pr.status === "pending" && <Clock className="h-5 w-5 text-slate-400" />}
                    {pr.status === "failed" && <AlertCircle className="h-5 w-5 text-red-600" />}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-slate-600">No provider runs yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
