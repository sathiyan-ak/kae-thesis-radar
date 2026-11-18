"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, BookOpen, BriefcaseBusiness, Building2, ChevronRight, CircleGauge,
  Database, FlaskConical, Menu, Plus, Radar, Search, Settings, X
} from "lucide-react";
import { candidates } from "@/lib/healthtech-data";

const nav = [
  ["/app", "Overview", CircleGauge],
  ["/app/intelligence", "Research intelligence", Radar],
  ["/app/dealflow", "Dealflow", BriefcaseBusiness],
  ["/app/companies", "Companies", Building2],
  ["/app/thesis", "Thesis map", FlaskConical],
  ["/app/research", "Research runs", Activity],
  ["/app/sources", "Sources", Database],
  ["/app/methodology", "Methodology", BookOpen],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [globalQuery, setGlobalQuery] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstNavRef = useRef<HTMLAnchorElement>(null);
  const current = nav.find(([href]) => href === "/app" ? path === "/app" : path.startsWith(href))?.[1] ?? "Workspace";
  const globalResults = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return [];
    return candidates.filter((candidate) =>
      [candidate.name, candidate.opportunity, candidate.status, candidate.recommendation, candidate.claim]
        .some((value) => value.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [globalQuery]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => firstNavRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }
      if (event.key === "Escape") {
        if (resultsOpen) {
          setResultsOpen(false);
          setGlobalQuery("");
        }
        if (open) {
          setOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, resultsOpen]);

  const navigateToResult = (index: number) => {
    const result = globalResults[index];
    if (!result) return;
    setResultsOpen(false);
    setGlobalQuery("");
    router.push(`/app/companies/${result.slug}`);
  };

  return (
    <div className="app">
      {open && <button className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand"><span className="brand-mark">OR</span><span className="brand-copy">Opportunity Radar<small>Kae Healthtech Edition</small></span><span className="demo-tag">Work sample</span></div>
        <nav className="nav" aria-label="Primary">
          <div className="nav-label">Workspace</div>
          {nav.map(([href, label, Icon], index) => (
            <Link key={href} ref={index === 0 ? firstNavRef : undefined} href={href} className={(href === "/app" ? path === "/app" : path.startsWith(href)) ? "active" : ""} onClick={() => setOpen(false)}>
              <Icon />{label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="provider">
            <div className="provider-row"><strong>Provider status</strong><span className="dot" /></div>
            <small>Live research unavailable in this demonstration</small>
          </div>
          <Link href="/app/settings" className="user" onClick={() => setOpen(false)}>
            <Settings size={16} /><span>Settings</span>
          </Link>
          <div className="user"><span className="avatar">DA</span><span>Demo Analyst<small>Work sample reviewer</small></span></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button ref={menuButtonRef} className="button icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X size={17}/> : <Menu size={17}/>}</button>
          <div className="crumb">Radar <ChevronRight size={13} style={{display:"inline", verticalAlign:"-2px"}}/> <strong>{current}</strong></div>
          <div className="global-search-wrap">
            <label className="search"><Search size={16}/><input ref={searchInputRef} value={globalQuery} onChange={(event) => { setGlobalQuery(event.target.value); setResultsOpen(Boolean(event.target.value.trim())); setActiveResult(0); }} onFocus={() => setResultsOpen(Boolean(globalQuery.trim()))} onKeyDown={(event) => {
              if (!resultsOpen || globalResults.length === 0) return;
              if (event.key === "ArrowDown") { event.preventDefault(); setActiveResult((activeResult + 1) % globalResults.length); }
              if (event.key === "ArrowUp") { event.preventDefault(); setActiveResult((activeResult - 1 + globalResults.length) % globalResults.length); }
              if (event.key === "Enter") { event.preventDefault(); navigateToResult(activeResult); }
            }} placeholder="Search companies, claims, sources…" aria-label="Global search" aria-expanded={resultsOpen}/><span className="kbd">⌘ K</span></label>
            {resultsOpen && (
              <div className="global-search-results" role="listbox" aria-label="Global search results">
                {globalResults.length ? globalResults.map((candidate, index) => (
                  <Link key={candidate.slug} href={`/app/companies/${candidate.slug}`} className={index === activeResult ? "active" : ""} role="option" aria-selected={index === activeResult} onMouseEnter={() => setActiveResult(index)} onClick={() => { setResultsOpen(false); setGlobalQuery(""); }}>
                    <strong>{candidate.name}</strong><small>{candidate.opportunity}</small>
                  </Link>
                )) : <div className="global-search-empty">No matching companies</div>}
              </div>
            )}
          </div>
          <button className="button primary new-screen" disabled title="Live research unavailable in this demonstration. Seeded evidence screens remain available for review."><Plus size={16}/><span>New screen</span></button>
        </header>
        {children}
      </main>
    </div>
  );
}
