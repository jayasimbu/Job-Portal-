import Card from '../ui/Card';
import { UI } from '../../constants/ui';

export default function StatCard({ title, value, icon, change, trend = "up", className = "" }) {
  const isUp = trend === "up";
  const trendColor = isUp ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20" : "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20";
  
  return (
    <Card className={`${UI.CARD_BASE} ${UI.CARD_FLEX} ${UI.STAT_CARD} relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-[#0f172a] hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group ${className}`}>
      {/* Background Subtle Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-start justify-between relative z-10">
        <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
          {title}
        </span>

        <div className="h-12 w-12 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-blue-500/10">
          {icon}
        </div>
      </div>

      <div className="flex items-end justify-between relative z-10">
        <h2 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {value}
        </h2>

        {change && (
          <span className={`px-2.5 py-1.5 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] shadow-sm ${trendColor}`}>
            {change}
          </span>
        )}
      </div>
    </Card>
  );
}
