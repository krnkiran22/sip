import { Zap, Activity, BarChart3, DollarSign } from "lucide-react";
import { GlassCard } from "./GlassCard";

const stats = [
  { label: "Total Intents", value: "1,284", icon: Zap, color: "text-purple-400" },
  { label: "Success Rate", value: "99.2%", icon: Activity, color: "text-emerald-400" },
  { label: "Active Intents", value: "12", icon: BarChart3, color: "text-blue-400" },
  { label: "Total Volume", value: "$420.5K", icon: DollarSign, color: "text-purple-400" },
];

export const StatsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    {stats.map((stat) => (
      <GlassCard key={stat.label} className="p-6">
        <div className="flex justify-between items-start mb-4">
          <p className="text-xs uppercase tracking-widest text-white/50 font-bold">{stat.label}</p>
          <stat.icon size={16} className={stat.color} />
        </div>
        <h3 className="text-3xl font-bold tracking-tighter">{stat.value}</h3>
      </GlassCard>
    ))}
  </div>
);
