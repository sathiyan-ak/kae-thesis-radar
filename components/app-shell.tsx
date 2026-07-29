"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Activity, BookOpen, BriefcaseBusiness, Building2, ChevronRight, CircleGauge,
  Database, FileSearch, FlaskConical, Menu, Plus, Search, Settings, X
} from "lucide-react";

const nav = [
  ["/", "Overview", CircleGauge],
  ["/dealflow", "Dealflow", BriefcaseBusiness],
  ["/companies", "Companies", Building2],
  ["/thesis-map", "Thesis map", FlaskConical],
  ["/research-runs", "Research runs", Activity],
  ["/sources", "Sources", Database],
  ["/methodology", "Methodology", BookOpen],
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const current = nav.find(([href]) => href === "/" ? path === "/" : path.startsWith(href))?.[1] ?? "Workspace";
  return (
    <div className="app">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand"><span className="brand-mark">K</span>Kae Thesis Radar <span className="demo-tag">Demo</span></div>
        <nav className="nav" aria-label="Primary">
          <div className="nav-label">Workspace</div>
          {nav.map(([href, label, Icon]) => (
            <Link key={href} href={href} className={(href === "/" ? path === "/" : path.startsWith(href)) ? "active" : ""} onClick={() => setOpen(false)}>
              <Icon />{label}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="provider">
            <div className="provider-row"><strong>Provider status</strong><span className="dot" /></div>
            <small>Research provider unavailable</small>
          </div>
          <Link href="/settings" className="user">
            <Settings size={16} /><span>Settings</span>
          </Link>
          <div className="user"><span className="avatar">AK</span><span>Arya Kapoor<small>Investment team</small></span></div>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <button className="button icon-button mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={17}/> : <Menu size={17}/>}</button>
          <div className="crumb">Radar <ChevronRight size={13} style={{display:"inline", verticalAlign:"-2px"}}/> <strong>{current}</strong></div>
          <label className="search"><Search size={16}/><input placeholder="Search companies, claims, sources…" aria-label="Global search"/><span className="kbd">⌘ K</span></label>
          <button className="button primary new-screen" title="Demo action only"><Plus size={16}/><span>New screen</span></button>
        </header>
        {children}
      </main>
    </div>
  );
}
