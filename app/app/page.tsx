import { AlertTriangle, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

export default function AppOverviewPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Investment research status and upcoming actions</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Deals Awaiting Review" value="3" icon={AlertTriangle} color="red" />
        <StatCard label="Screens This Week" value="12" icon={TrendingUp} color="blue" />
        <StatCard label="Stale (>7d)" value="5" icon={Clock} color="amber" />
        <StatCard label="Completed" value="142" icon={CheckCircle2} color="green" />
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <p className="text-sm text-slate-600">No recent screens yet. Create your first by clicking "New Screen".</p>
        </div>
      </div>

      {/* Thesis Coverage */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Thesis Coverage</h2>
          <p className="text-sm text-slate-600 mb-4">
            You have access to 20 Kae healthtech opportunity areas. Visit the Thesis page to explore.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "red" | "blue" | "amber" | "green";
}) {
  const colorClasses = {
    red: "bg-red-50 text-red-600 border-red-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    amber: "bg-amber-50 text-amber-600 border-amber-200",
    green: "bg-green-50 text-green-600 border-green-200",
  };

  return (
    <div className={`rounded-lg border p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <Icon className="h-8 w-8 opacity-50" />
      </div>
    </div>
  );
}
