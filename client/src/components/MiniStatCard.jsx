const MiniStatCard = ({ label, value, icon: Icon, color, bg, index = 0 }) => {


  return (
    <div
      className="animate-fade-in-up hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-6"
    // style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}
        >
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="min-w-0">
          <p className='text-2xl font-bold text-slate-900 dark:text-slate-100 leading-tight'>
            {value}
          </p>
          <p className='text-[13px] font-medium text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis'>
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MiniStatCard;
