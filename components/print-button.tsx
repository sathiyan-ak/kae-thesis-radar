"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button onClick={() => window.print()} className="no-print inline-flex items-center gap-2 rounded-xl border border-white/10 px-3.5 py-2.5 text-xs text-zinc-300 transition hover:border-emerald-200/20 hover:text-white">
      <Printer className="h-4 w-4" /> Export screen
    </button>
  );
}
