import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

  useEffect(() => {
    API.get("/dashboard").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const cards = [
    { label: "Total Tasks", value: stats.total, color: "from-indigo-500 to-purple-600", icon: "📋" },
    { label: "To Do", value: stats.todo, color: "from-amber-500 to-orange-600", icon: "📝" },
    { label: "In Progress", value: stats.inProgress, color: "from-blue-500 to-cyan-600", icon: "⏳" },
    { label: "Done", value: stats.done, color: "from-emerald-500 to-green-600", icon: "✅" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => (
          <div
            key={c.label}
            className="relative overflow-hidden rounded-2xl p-6 bg-surface-card border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <div className="relative">
              <span className="text-3xl mb-3 block">{c.icon}</span>
              <p className="text-text-muted text-sm font-medium">{c.label}</p>
              <p className="text-3xl font-bold mt-1">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
