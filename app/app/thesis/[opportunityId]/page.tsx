export default async function ThesisOpportunityPage(props: {
  params: Promise<{ opportunityId: string }>;
}) {
  const params = await props.params;

  return (
    <div className="p-8">
      <div className="mb-8">
        <a href="/app/thesis" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Thesis
        </a>
        <h1 className="text-3xl font-bold text-slate-900">Opportunity {params.opportunityId}</h1>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <p className="text-slate-600">Opportunity details coming in Phase 8.</p>
      </div>
    </div>
  );
}
