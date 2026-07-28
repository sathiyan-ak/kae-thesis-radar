export default async function ResearchRunPage(props: {
  params: Promise<{ runId: string }>;
}) {
  const params = await props.params;

  return (
    <div className="p-8">
      <div className="mb-8">
        <a href="/app/dealflow" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Dealflow
        </a>
        <h1 className="text-3xl font-bold text-slate-900">Research Run {params.runId}</h1>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <p className="text-slate-600">Research progress coming in Phase 3.</p>
      </div>
    </div>
  );
}
