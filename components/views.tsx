"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowDownToLine, ArrowRight, Check, ChevronRight, CircleAlert, ExternalLink, FileWarning, Filter, MoreHorizontal, RefreshCw, SlidersHorizontal, X } from "lucide-react";

const companies = [
  { name:"VoltGrid", thesis:"Grid flexibility", stage:"Series A", status:"Needs review", rec:"Watch", score:72, claims:"8 / 11", freshness:"14 days", owner:"A. Kapoor", reviewed:"12 Jul 2026" },
  { name:"Cirrus Carbon", thesis:"Industrial carbon", stage:"Seed", status:"Screened", rec:"Advance", score:84, claims:"12 / 14", freshness:"3 days", owner:"M. Shah", reviewed:"24 Jul 2026" },
  { name:"ParcelOS", thesis:"Logistics software", stage:"Series A", status:"Incomplete", rec:"Hold", score:61, claims:"5 / 9", freshness:"47 days", owner:"J. Lin", reviewed:"18 Jun 2026" },
  { name:"Forma Health", thesis:"Care infrastructure", stage:"Seed", status:"Needs review", rec:"Watch", score:69, claims:"7 / 12", freshness:"29 days", owner:"A. Kapoor", reviewed:"01 Jul 2026" },
  { name:"Kiln Robotics", thesis:"Industrial automation", stage:"Seed", status:"Screened", rec:"Advance", score:81, claims:"10 / 12", freshness:"6 days", owner:"M. Shah", reviewed:"21 Jul 2026" },
  { name:"LedgerLeaf", thesis:"Climate accounting", stage:"Pre-seed", status:"Incomplete", rec:"Pass", score:48, claims:"3 / 8", freshness:"64 days", owner:"Unassigned", reviewed:"27 May 2026" },
];

function Badge({ children, tone="" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export function OverviewView() {
  return <div className="content">
    <div className="page-head"><div><div className="label">Wednesday, 29 July</div><h1>Research overview</h1><p>Priorities and changes across the seeded demonstration workspace.</p></div><Badge>Seeded demo data</Badge></div>
    <div className="grid-2">
      <section className="panel">
        <div className="panel-head"><h2>Attention queue</h2><span>6 open items</span></div>
        {[
          ["3 claims lack primary evidence","VoltGrid · Commercial traction","High"],
          ["Research run ended partial","ParcelOS · Provider timeout","High"],
          ["Screen is 64 days old","LedgerLeaf · Climate accounting","Review"],
          ["Analyst recommendation missing","Forma Health · Care infrastructure","Review"],
        ].map(([a,b,c],i)=><div className="queue-row" key={a}><span className="queue-icon">{i<2?<CircleAlert size={15}/>:<FileWarning size={15}/>}</span><div><strong>{a}</strong><small>{b}</small></div><span className="severity">{c}</span></div>)}
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Thesis coverage</h2><span>Verified claims / target</span></div>
        <div className="coverage">
          {[["Grid flexibility",72,18],["Industrial automation",61,11],["Care infrastructure",44,8],["Industrial carbon",83,20],["Logistics software",36,6]].map(([n,p,c])=><div className="coverage-row" key={n}><span>{n}</span><div className="bar"><i style={{width:`${p}%`}}/></div><em>{c} claims</em></div>)}
        </div>
      </section>
    </div>
    <section className="panel section-gap">
      <div className="panel-head"><h2>Recently updated</h2><Link href="/dealflow">View dealflow <ArrowRight size={13} style={{verticalAlign:"-2px"}}/></Link></div>
      <div className="table-wrap"><table><thead><tr><th>Company</th><th>Change</th><th>Owner</th><th>Evidence</th><th>Updated</th></tr></thead><tbody>
        <tr><td><Link className="company-cell" href="/companies/voltgrid"><span className="company-logo">VG</span>VoltGrid</Link></td><td>New customer claim added</td><td>A. Kapoor</td><td><span className="danger">Needs verification</span></td><td className="muted">2 hours ago</td></tr>
        <tr><td><span className="company-cell"><span className="company-logo">CC</span>Cirrus Carbon</span></td><td>Screen recommendation changed</td><td>M. Shah</td><td>2 primary sources</td><td className="muted">Yesterday</td></tr>
        <tr><td><span className="company-cell"><span className="company-logo">KR</span>Kiln Robotics</span></td><td>Research run completed</td><td>M. Shah</td><td>4 new sources</td><td className="muted">2 days ago</td></tr>
      </tbody></table></div>
    </section>
  </div>;
}

export function DealflowView() {
  const router = useRouter(); const params = useSearchParams();
  const [selected,setSelected] = useState<string[]>([]);
  const [sort,setSort] = useState(params.get("sort") || "reviewed");
  const [stage,setStage] = useState(params.get("stage") || "all");
  const [query,setQuery] = useState(params.get("q") || "");
  const rows = useMemo(()=>companies.filter(c=>(stage==="all"||c.stage===stage)&&c.name.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==="score"?b.score-a.score:a.name.localeCompare(b.name)),[stage,query,sort]);
  const sync=(next:Record<string,string>)=>{const p=new URLSearchParams(params.toString());Object.entries(next).forEach(([k,v])=>v&&v!=="all"?p.set(k,v):p.delete(k));router.replace(`/dealflow?${p}`)};
  const exportCsv=()=>{const csv=["Company,Thesis,Stage,Score,Owner",...rows.map(c=>`${c.name},${c.thesis},${c.stage},${c.score},${c.owner}`)].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="kae-dealflow-demo.csv";a.click()};
  return <div className="content">
    <div className="page-head"><div><div className="label">Screening workspace</div><h1>Dealflow</h1><p>Compare screened companies and resolve evidence gaps.</p></div><Badge>6 seeded records</Badge></div>
    <section className="panel">
      <div className="toolbar">
        <input className="control" style={{minWidth:220}} value={query} onChange={e=>{setQuery(e.target.value);sync({q:e.target.value})}} placeholder="Filter companies…" aria-label="Filter companies"/>
        <select className="control" value={stage} onChange={e=>{setStage(e.target.value);sync({stage:e.target.value})}} aria-label="Filter by stage"><option value="all">All stages</option><option>Seed</option><option>Pre-seed</option><option>Series A</option></select>
        <select className="control" value={sort} onChange={e=>{setSort(e.target.value);sync({sort:e.target.value})}} aria-label="Sort dealflow"><option value="reviewed">Sort: Company</option><option value="score">Sort: Score</option></select>
        <button className="button"><SlidersHorizontal size={15}/> Columns</button>
        <button className="button push" onClick={exportCsv}><ArrowDownToLine size={15}/> Export CSV</button>
      </div>
      <div className="table-wrap" style={{maxHeight:520}}><table><thead><tr><th><input type="checkbox" aria-label="Select all rows" checked={selected.length===rows.length&&rows.length>0} onChange={e=>setSelected(e.target.checked?rows.map(r=>r.name):[])}/></th><th>Company</th><th>Thesis</th><th>Stage</th><th>Screen status</th><th>Recommendation</th><th>Score</th><th>Verified claims</th><th>Source freshness</th><th>Owner</th><th>Last reviewed</th></tr></thead><tbody>
        {rows.map(c=><tr key={c.name} tabIndex={0}><td><input type="checkbox" aria-label={`Select ${c.name}`} checked={selected.includes(c.name)} onChange={e=>setSelected(e.target.checked?[...selected,c.name]:selected.filter(x=>x!==c.name))}/></td><td><Link className="company-cell" href={c.name==="VoltGrid"?"/companies/voltgrid":"#"}><span className="company-logo">{c.name.split(/(?=[A-Z])/).map(x=>x[0]).join("").slice(0,2)}</span>{c.name}</Link></td><td>{c.thesis}</td><td>{c.stage}</td><td><Badge tone={c.status==="Screened"?"good":c.status==="Incomplete"?"fail":"review"}>{c.status}</Badge></td><td>{c.rec}</td><td className="score">{c.score}</td><td>{c.claims}</td><td className={parseInt(c.freshness)>30?"danger":""}>{c.freshness}</td><td>{c.owner}</td><td className="muted">{c.reviewed}</td></tr>)}
      </tbody></table>{rows.length===0&&<div style={{padding:48,textAlign:"center"}}><strong>No matching companies</strong><p className="muted">Adjust the current filters to return seeded records.</p></div>}</div>
      <div className="pagination"><span>{selected.length?`${selected.length} selected`:`1–${rows.length} of ${rows.length}`}</span><div><button className="button" disabled>Previous</button> <button className="button" disabled>Next</button></div></div>
    </section>
  </div>;
}

const claims = [
  ["Operates 420 MW of flexible load across 34 commercial sites.","Verified","High","14 Jun 2026","4"],
  ["Signed a three-year flexibility agreement with NorthGrid.","Verified","High","02 May 2026","3"],
  ["Annual recurring revenue exceeded £4m in FY2025.","Needs evidence","Medium","31 Dec 2025","1"],
  ["Gross retention remained above 95% for two years.","Contradicted","Low","31 Mar 2026","2"],
];

export function CompanyView() {
  const [drawer,setDrawer]=useState(false);
  return <div className="content">
    <section className="panel company-header">
      <div className="company-title"><span className="company-logo">VG</span><div><h1>VoltGrid</h1><p>voltgrid.example · London, UK · Grid flexibility</p></div><div className="company-actions"><button className="button primary" disabled title="Provider unavailable"><RefreshCw size={15}/>Run research</button><button className="button icon-button"><MoreHorizontal size={17}/></button></div></div>
      <div className="header-metrics"><div className="metric"><span>Machine recommendation</span><strong>Watch</strong></div><div className="metric"><span>Analyst recommendation</span><strong>Needs review</strong></div><div className="metric"><span>Total score</span><strong>72 / 100</strong></div><div className="metric"><span>Last reviewed</span><strong>12 Jul 2026</strong></div></div>
    </section>
    <div className="notice section-gap"><AlertTriangle size={17}/><div><strong>Demo state — research provider unavailable.</strong><br/>The records below are seeded interface examples. No live research run will be started.</div></div>
    <div className="company-grid"><main className="stack">
      <section className="panel summary"><div className="label">Investment summary</div><p>VoltGrid coordinates flexible commercial energy loads for grid operators. Evidence supports meaningful contracted capacity and a credible utility partnership, while revenue scale and retention quality still require primary documentation.</p></section>
      <section className="panel"><div className="panel-head"><h2>Score breakdown</h2><span>72 total · 5 point missing-data penalty</span></div>{[["Market urgency",82,20,"16.4"],["Team & execution",74,20,"14.8"],["Commercial traction",68,25,"17.0"],["Defensibility",71,20,"14.2"],["Regulatory readiness",64,15,"9.6"]].map(([n,v,w,c])=><div className="score-row" key={n}><span>{n}</span><div className="bar"><i style={{width:`${v}%`}}/></div><span className="value">{v}</span><span className="value muted">{c} / {w}</span></div>)}</section>
      <section className="panel"><div className="panel-head"><h2>Verified signals</h2><span>Click a claim to inspect evidence</span></div>{claims.slice(0,2).map((c,i)=><Claim key={c[0]} c={c} onClick={()=>setDrawer(true)} i={i}/>)}</section>
      <section className="panel"><div className="panel-head"><h2>Risks and contradictions</h2><span>2 open</span></div>{claims.slice(2).map((c,i)=><Claim key={c[0]} c={c} onClick={()=>setDrawer(true)} i={i+2}/>)}</section>
      {["Missing information","Diligence questions","Source timeline","Research-run history"].map((n,i)=><section className="panel" key={n}><div className="panel-head"><h2>{n}</h2><span>{i===0?"3 unresolved":i===1?"5 open":i===2?"14 sources":"2 runs"}</span></div><div style={{padding:"16px",color:"var(--muted)"}}>{i===0?"No verified revenue data · Customer concentration · Current cash runway":i===1?"Request ARR bridge, top-customer concentration and signed utility contract.":i===2?"Latest source retrieved 14 days ago. Primary and company sources represented.":"Latest run ended partial after a provider timeout."}</div></section>)}
    </main><aside className="stack">
      <section className="panel"><div className="panel-head"><h2>Analyst status</h2></div><div className="rail-list">{[["Screen","Needs review"],["Legal identity","Confirmed"],["Source coverage","8 / 11 claims"],["Freshness","14 days"],["Provider coverage","Unavailable"],["Analyst owner","A. Kapoor"]].map(([a,b])=><div className="rail-row" key={a}><span>{a}</span><strong>{b}</strong></div>)}</div></section>
      <button className="button"><ArrowDownToLine size={15}/> Export demo memo</button>
    </aside></div>
    {drawer&&<><div className="drawer-backdrop" onClick={()=>setDrawer(false)}/><aside className="drawer" role="dialog" aria-label="Claim evidence"><div className="drawer-head"><div><div className="label">Claim evidence</div><h2>NorthGrid agreement</h2></div><button className="button icon-button" onClick={()=>setDrawer(false)} aria-label="Close evidence drawer"><X size={17}/></button></div><div className="detail-grid"><div><span>Publisher</span><strong>NorthGrid plc</strong></div><div><span>Source tier</span><strong>Primary</strong></div><div><span>Published</span><strong>02 May 2026</strong></div><div><span>Retrieved</span><strong>15 Jul 2026</strong></div></div><blockquote>VoltGrid will provide demand flexibility across NorthGrid’s commercial network under a three-year framework agreement.</blockquote><a className="button" href="#" onClick={e=>e.preventDefault()}>Original unavailable in demo <ExternalLink size={14}/></a></aside></>}
  </div>;
}

function Claim({c,onClick,i}:{c:string[];onClick:()=>void;i:number}) {return <div className="claim" onClick={onClick} tabIndex={0} onKeyDown={e=>e.key==="Enter"&&onClick()}><div><strong>{c[0]}</strong><br/><small>Effective {c[3]}</small></div><Badge tone={i<2?"good":i===2?"review":"fail"}>{c[1]}</Badge><span>{c[2]} confidence</span><span>{c[4]} sources</span><ChevronRight size={16}/></div>}

export function ResearchView() {
  const stages=[["Company identity","Registry API","Completed","1.8s","3 sources"],["Web discovery","Search provider","Partial","12.4s","18 sources"],["Source retrieval","Research provider","Failed","30.0s","Provider timeout"],["Claim extraction","—","Skipped","—","Upstream failed"],["Scoring","—","Skipped","—","Insufficient evidence"]];
  return <div className="content"><div className="page-head"><div><div className="label">Run KR-2026-0718-04</div><h1>ParcelOS research run</h1><p>Operational trace for a seeded, incomplete research example.</p></div><Badge tone="fail">Partial</Badge></div><div className="notice"><AlertTriangle size={17}/><div><strong>This is a seeded run record, not a live execution.</strong><br/>The provider is unavailable and retry controls are disabled.</div></div><section className="panel section-gap"><div className="panel-head"><h2>Run timeline</h2><span>Started 18 Jul 2026 · 44.2s</span></div><div className="timeline">{stages.map((s,i)=><div className="stage" key={s[0]}><span className={`stage-dot ${i===2?"fail":i>2?"skip":""}`}/><div><strong>{s[0]}</strong><small>{s[1]}</small></div><Badge tone={i===2?"fail":i>2?"":"good"}>{s[2]}</Badge><span>{s[3]}</span><span className="muted">{s[4]}</span></div>)}</div></section><section className="panel section-gap"><div className="panel-head"><h2>Error detail</h2><span>Attempt 1 of 1</span></div><div style={{padding:16}}><strong>Provider timeout</strong><p className="muted">The source retrieval provider did not respond within the configured timeout. No completion result was recorded.</p><button className="button" disabled><RefreshCw size={15}/> Retry unavailable</button></div></section></div>;
}

const thesisRows=[["Grid flexibility","Energy","Utilities","SaaS + revenue share","High","Medium","8","74","2 days"],["Industrial carbon","Climate","Plant operators","Project + software","High","Low","4","78","5 days"],["Industrial automation","Industry","Manufacturers","Hardware + SaaS","Medium","High","12","71","1 day"],["Care infrastructure","Health","Care providers","SaaS","High","Low","5","66","18 days"],["Logistics software","Supply chain","3PLs","SaaS","Low","High","14","63","6 days"]];
export function ThesisView(){const [selected,setSelected]=useState(thesisRows[0]);return <div className="content"><div className="page-head"><div><div className="label">Coverage matrix</div><h1>Thesis map</h1><p>Find under-covered opportunities and inspect their evidence density.</p></div><Badge>Seeded demo data</Badge></div><div className="thesis-layout"><section className="panel"><div className="toolbar"><select className="control"><option>All categories</option><option>Energy</option><option>Climate</option></select><select className="control"><option>All regulatory levels</option><option>High</option><option>Medium</option></select><button className="button"><Filter size={15}/> More filters</button></div><div className="table-wrap"><table><thead><tr><th>Opportunity</th><th>Category</th><th>Buyer</th><th>Business model</th><th>Regulatory</th><th>Density</th><th>Companies</th><th>Avg score</th><th>Refreshed</th></tr></thead><tbody>{thesisRows.map(r=><tr key={r[0]} tabIndex={0} onClick={()=>setSelected(r)}><td><strong>{r[0]}</strong></td>{r.slice(1).map((v,i)=><td key={i} className={i===7?"muted":""}>{i===3?<Badge tone={v==="High"?"review":""}>{v}</Badge>:v}</td>)}</tr>)}</tbody></table></div></section><aside className="panel detail-panel"><div className="panel-head"><h2>Opportunity detail</h2></div><div className="body"><div className="label">{selected[1]}</div><h3>{selected[0]}</h3><p>Coverage is based on seeded company screens and verified-claim counts. This panel does not represent live market research.</p><div className="rail-list" style={{padding:0}}><div className="rail-row"><span>Mapped companies</span><strong>{selected[6]}</strong></div><div className="rail-row"><span>Average score</span><strong>{selected[7]}</strong></div><div className="rail-row"><span>Evidence density</span><strong>{selected[5]}</strong></div><div className="rail-row"><span>Last refreshed</span><strong>{selected[8]} ago</strong></div></div></div></aside></div></div>}

export function PlaceholderView({title}:{title:string}){return <div className="content"><div className="page-head"><div><div className="label">Frontend demonstration</div><h1>{title}</h1><p>This routed surface is reserved for live workspace data. No infrastructure is connected in this demo.</p></div><Badge>Unavailable</Badge></div><section className="panel" style={{padding:48,textAlign:"center"}}><CircleAlert size={24} style={{margin:"0 auto 12px",color:"var(--muted)"}}/><strong>{title} data is not connected</strong><p className="muted">Backend contracts are unchanged. Connect the existing data source to populate this view.</p></section></div>}
