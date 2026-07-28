export default async function CompanyDetailPage(props: {
  params: Promise<{ companyId: string }>;
}) {
  const params = await props.params;

  return (
    <div className="p-8">
      <div className="mb-8">
        <a href="/app/companies" className="text-sm text-blue-600 hover:text-blue-700 mb-4 inline-block">
          ← Back to Companies
        </a>
        <h1 className="text-3xl font-bold text-slate-900">Company {params.companyId}</h1>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8">
        <p className="text-slate-600">Company details coming in Phase 7.</p>
      </div>
    </div>
  );
}
