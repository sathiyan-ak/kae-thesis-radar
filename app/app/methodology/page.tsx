export default function MethodologyPage() {
  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-slate-900">Methodology</h1>
      <p className="mt-2 text-slate-600 mb-8">How research is conducted and scored</p>

      <div className="space-y-8">
        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Source Tiers</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-medium text-slate-900">Tier 1: Primary Evidence</h3>
              <p className="text-slate-600">Official company pages, government registries, regulatory databases, clinical-trial registries, peer-reviewed papers.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Tier 2: Secondary Evidence</h3>
              <p className="text-slate-600">Reputable financial publications, investor announcements, recognized research organizations.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Tier 3: Tertiary Sources</h3>
              <p className="text-slate-600">Company databases, sector directories, trade blogs, aggregator profiles.</p>
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Tier 4: Weak Signals</h3>
              <p className="text-slate-600">Search snippets, social posts, unverified directories.</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Claim Verification</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>• <strong>Verified:</strong> Tier 1 evidence conclusively establishes the claim</li>
            <li>• <strong>Supported:</strong> Tier 2+ evidence supports the claim</li>
            <li>• <strong>Inferred:</strong> Analytical conclusion from multiple sources</li>
            <li>• <strong>Disputed:</strong> Conflicting evidence exists</li>
            <li>• <strong>Unknown:</strong> Insufficient data available</li>
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Scoring Dimensions</h2>
          <div className="space-y-2 text-sm text-slate-600">
            <div>
              <span className="font-medium text-slate-900">Thesis Fit (24%)</span> — How well the company's business model aligns with this specific opportunity
            </div>
            <div>
              <span className="font-medium text-slate-900">Founder-Market Fit (18%)</span> — Evidence of founder domain depth and clinical/regulatory understanding
            </div>
            <div>
              <span className="font-medium text-slate-900">Market Timing (16%)</span> — Regulatory tailwinds, adoption curves, and market readiness
            </div>
            <div>
              <span className="font-medium text-slate-900">Distribution (16%)</span> — Customer traction, partnerships, and go-to-market evidence
            </div>
            <div>
              <span className="font-medium text-slate-900">Defensibility (14%)</span> — IP, data advantages, switching costs, and competitive moats
            </div>
            <div>
              <span className="font-medium text-slate-900">Capital Efficiency (12%)</span> — Unit economics and burn rate relative to cohort
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
