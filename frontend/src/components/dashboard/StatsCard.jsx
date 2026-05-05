const StatsCard = ({ title, value, icon: Icon, trend, trendValue, colorClass }) => {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border border-surface-200 dark:border-surface-700 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-surface-900 dark:text-white">{value}</h2>
        {trend && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend === 'up' ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-rose-700 bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
