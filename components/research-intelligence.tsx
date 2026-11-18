"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Database, Info, Search, ShieldAlert } from "lucide-react";
import { researchSignals, researchSnapshot, sourceCoverage, unitTypeLabels, type ResearchSignal, type ResearchUnitType } from "@/lib/research-intelligence-data";

const format = new Intl.NumberFormat("en-US");
const percent = (value: number) => `${Math.round(value * 100)}%`;

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return <div className="intel-metric"><span>{label}</span><strong>{value}</strong><small>{note}</small></div>;
}

function StageBadge({ lifecycle }: { lifecycle: ResearchSignal["lifecycle"] }) {
  return <span className={`intel-stage ${lifecycle.toLowerCase()}`}>{lifecycle === "New" ? "Needs baseline" : lifecycle}</span>;
}

function PriorityChart({ rows }: { rows: ResearchSignal[] }) {
  const maximum = Math.max(...rows.map(row => row.score), 1);
  return <div className="intel-bars" aria-label="Priority score chart">
    {rows.map((row, index) => <div className="intel-bar-row" key={row.id}>
      <div className="intel-bar-label"><b>{index + 1}</b><span>{row.label}<small>{row.papers90d} papers · 90 days</small></span></div>
      <div className="intel-bar-track"><i className={row.lifecycle.toLowerCase()} style={{ width: `${(row.score / maximum) * 100}%` }}/></div>
      <strong>{row.score.toFixed(2)}</strong>
    </div>)}
  </div>;
}

export function ResearchIntelligence() {
  const [type, setType] = useState<ResearchUnitType>("openalex_topics");
  const [tab, setTab] = useState<"brief" | "evidence" | "quality">("brief");
  const [query, setQuery] = useState("");
  const rows = useMemo(() => researchSignals.filter(row => row.type === type && row.label.toLowerCase().includes(query.toLowerCase())), [query, type]);
  const top = rows[0];
  const baselineLimited = rows.filter(row => row.lifecycle === "New").length;

  return <div className="content intel-shell">
    <section className="intel-hero">
      <div><div className="intel-kicker">RESEARCH INTELLIGENCE / FROZEN SNAPSHOT</div><h1>From papers to perspective.</h1><p>Economics, finance and international-business research signals made reviewable and diagnosable.</p></div>
      <span className="intel-date">AS OF {researchSnapshot.asOf.toUpperCase()}</span>
    </section>

    <section className="intel-metrics">
      <Metric label="Collected papers" value={format.format(researchSnapshot.totalPapers)} note="All connected sources"/>
      <Metric label="In-scope papers" value={format.format(researchSnapshot.inScopePapers)} note="Used by the research engine"/>
      <Metric label="Eligible signals" value={format.format(researchSnapshot.eligibleUnits)} note="Across all unit types"/>
      <Metric label="Baseline limited" value={format.format(researchSnapshot.baselineLimited)} note="Read and track before claiming growth"/>
    </section>

    <div className="intel-callout"><Info size={17}/><span>Scores are heuristics for where to look. Topics overlap, and a high score does not establish paper quality, causal importance or an unanswered research gap.</span></div>

    <div className="intel-tabs" role="tablist" aria-label="Research intelligence views">
      <button role="tab" aria-selected={tab === "brief"} onClick={() => setTab("brief")}>Executive brief</button>
      <button role="tab" aria-selected={tab === "evidence"} onClick={() => setTab("evidence")}>Signal evidence</button>
      <button role="tab" aria-selected={tab === "quality"} onClick={() => setTab("quality")}>Data quality</button>
    </div>

    {tab !== "quality" && <div className="intel-controls">
      <div className="intel-type-switch" aria-label="Compare within a unit type">
        {(Object.keys(unitTypeLabels) as ResearchUnitType[]).map(value => <button key={value} className={type === value ? "active" : ""} onClick={() => setType(value)}>{unitTypeLabels[value]}</button>)}
      </div>
      <label className="intel-search"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Filter signals…" aria-label="Filter research signals"/></label>
    </div>}

    {tab === "brief" && <>
      <div className="intel-grid">
        <section className="intel-panel"><div className="intel-panel-head"><div><span>RELATIVE PRIORITY</span><h2>Which signals deserve a closer look?</h2></div><small>Compare within {unitTypeLabels[type].toLowerCase()}</small></div>
          {rows.length ? <PriorityChart rows={rows}/> : <div className="intel-empty">No signals match this filter.</div>}
        </section>
        <aside className="intel-panel intel-reading"><div className="intel-panel-head"><div><span>HOW TO READ THIS</span><h2>Evidence before momentum</h2></div></div>
          <div className="intel-donut" style={{ "--baseline-share": `${rows.length ? (baselineLimited / rows.length) * 100 : 0}%` } as React.CSSProperties}><strong>{rows.length ? Math.round((baselineLimited / rows.length) * 100) : 0}%</strong><span>need a<br/>baseline</span></div>
          <p><b>{baselineLimited} of {rows.length}</b> visible signals have insufficient comparison history. Their neutral stored growth value is not evidence of a flat trend.</p>
          {top && <div className="intel-next"><span>Suggested next step</span><strong>Read the papers behind “{top.label}”</strong><p>Narrow the question and collect a comparable baseline before making a momentum claim.</p></div>}
        </aside>
      </div>
    </>}

    {tab === "evidence" && <section className="intel-panel"><div className="intel-panel-head"><div><span>REVIEWABLE SIGNALS</span><h2>What is behind each ranking?</h2></div><small>{rows.length} signals shown</small></div>
      <div className="intel-table-wrap"><table className="intel-table"><thead><tr><th>Signal</th><th>Stage</th><th>Priority</th><th>Papers · 90d</th><th>Interest fit</th><th>Gap heuristic</th></tr></thead><tbody>
        {rows.map(row => <tr key={row.id}><td><strong>{row.label}</strong><small>{row.id}</small></td><td><StageBadge lifecycle={row.lifecycle}/></td><td>{row.score.toFixed(2)}</td><td>{format.format(row.papers90d)}</td><td><span className="intel-mini-bar"><i style={{width: percent(row.fit)}}/></span>{percent(row.fit)}</td><td>{row.gap.toFixed(3)}</td></tr>)}
      </tbody></table></div>
      {!rows.length && <div className="intel-empty">No signals match this filter.</div>}
    </section>}

    {tab === "quality" && <div className="intel-grid intel-quality-grid">
      <section className="intel-panel"><div className="intel-panel-head"><div><span>METADATA COVERAGE</span><h2>Know the limits of the evidence</h2></div></div>
        <div className="intel-quality-row"><span>Missing abstracts<small>Weakens semantic grouping and interpretation</small></span><div><i style={{width: percent(researchSnapshot.missingAbstracts / researchSnapshot.totalPapers)}}/></div><strong>{format.format(researchSnapshot.missingAbstracts)} · {percent(researchSnapshot.missingAbstracts / researchSnapshot.totalPapers)}</strong></div>
        <div className="intel-quality-row"><span>Year-only date proxies<small>Excluded from dated comparisons</small></span><div><i style={{width: percent(researchSnapshot.dateProxies / researchSnapshot.totalPapers)}}/></div><strong>{format.format(researchSnapshot.dateProxies)} · {percent(researchSnapshot.dateProxies / researchSnapshot.totalPapers)}</strong></div>
        <div className="intel-quality-row"><span>Missing dates<small>Cannot contribute to time-series evidence</small></span><div><i style={{width: percent(researchSnapshot.missingDates / researchSnapshot.totalPapers)}}/></div><strong>{format.format(researchSnapshot.missingDates)} · &lt;1%</strong></div>
        <div className="intel-warning"><ShieldAlert size={18}/><p><b>Diagnostic rule:</b> missing metadata is surfaced as uncertainty. It is never silently converted into a measured zero.</p></div>
      </section>
      <section className="intel-panel"><div className="intel-panel-head"><div><span>SOURCE DIAGNOSTICS</span><h2>Can the snapshot be trusted?</h2></div></div>
        <div className="intel-source-list">{sourceCoverage.map(source => <div className="intel-source" key={source.source}>
          <span className={source.status === "Passing" ? "source-ok" : "source-off"}>{source.status === "Passing" ? <CheckCircle2 size={16}/> : <AlertTriangle size={16}/>}</span>
          <div><strong>{source.source}</strong><small>{source.status === "Passing" ? `${format.format(source.items)} records returned on the latest check` : "Disabled in the current engine configuration"}</small></div>
          <em>{source.papers ? format.format(source.papers) : "—"}<small>stored</small></em>
        </div>)}</div>
        <div className="intel-callout compact"><Database size={16}/><span>A passing fetch confirms the request worked. It does not prove complete historical coverage.</span></div>
      </section>
    </div>}
  </div>;
}
