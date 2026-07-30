export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
      <p className="mt-2 text-slate-600 mb-8">Workspace and user preferences</p>

      <div className="space-y-8">
        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Name</label>
              <input
                type="text"
                defaultValue="Your Name"
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Email</label>
              <input
                type="email"
                defaultValue="you@example.com"
                disabled
                className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-600 bg-slate-50 cursor-not-allowed"
              />
            </div>
            <button className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">API Credentials (Phase 9)</h2>
          <p className="text-sm text-slate-600 mb-4">Configure research providers and API keys.</p>
          <div className="space-y-4 opacity-50">
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-2">Tavily API Key</label>
              <input
                type="password"
                placeholder="tvly-..."
                disabled
                className="w-full rounded-lg border border-slate-300 px-4 py-2"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Session</h2>
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-900 hover:bg-slate-50">
            Sign Out
          </button>
        </section>
      </div>
    </div>
  );
}
