import { Metadata } from "next";
import Link from "next/link";
import {
  LayoutGrid,
  TrendingUp,
  Building2,
  Lightbulb,
  FileText,
  Compass,
  Settings,
  Search,
  Plus,
  Bell,
  CircleUser,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard - Kae Thesis Radar",
};

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <nav className="w-64 border-r border-slate-200 bg-white p-4 flex flex-col overflow-y-auto">
        <div className="mb-8">
          <h1 className="text-lg font-bold text-slate-900">Kae Radar</h1>
          <p className="text-xs text-slate-500">Research OS</p>
        </div>

        <div className="space-y-1 mb-8 flex-1">
          <NavLink href="/app" icon={LayoutGrid} label="Overview" />
          <NavLink href="/app/dealflow" icon={TrendingUp} label="Dealflow" />
          <NavLink href="/app/companies" icon={Building2} label="Companies" />
          <NavLink href="/app/thesis" icon={Lightbulb} label="Thesis" />
          <NavLink href="/app/sources" icon={FileText} label="Sources" />

          <div className="my-4 border-t border-slate-200" />

          <NavLink href="/app/methodology" icon={Compass} label="Methodology" />
          <NavLink href="/app/settings" icon={Settings} label="Settings" />
        </div>

        {/* Status bar */}
        <div className="border-t border-slate-200 pt-4">
          <div className="text-xs text-slate-600 space-y-1">
            <div>
              <span className="text-slate-500">Last sync:</span>{" "}
              <span className="text-slate-900 font-medium">2 min ago</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
              <span className="text-slate-500">All systems operational</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="border-b border-slate-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                New Screen
              </button>

              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
              </button>

              <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <CircleUser className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
