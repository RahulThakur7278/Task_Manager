import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../../context/ThemeContext';
import { CHART_COLORS } from '../../../utils/constants';

const Chart = ({ barData: liveBarData, stats }) => {
  const { theme } = useTheme();

  const pieData = stats ? [
    { name: 'Completed', value: stats.completedTasks || 0, color: CHART_COLORS.success },
    { name: 'In Progress', value: stats.inProgressTasks || 0, color: CHART_COLORS.accent },
    { name: 'Pending', value: stats.pendingTasks || 0, color: CHART_COLORS.warning },
  ] : [
    { name: 'Completed', value: 16, color: CHART_COLORS.success },
    { name: 'In Progress', value: 4, color: CHART_COLORS.accent },
    { name: 'Pending', value: 8, color: CHART_COLORS.warning },
  ];

  const barData = (liveBarData && liveBarData.length > 0) ? liveBarData : [
    { date: 'Mon', created: 3, completed: 2, inProgress: 1 },
    { date: 'Tue', created: 5, completed: 3, inProgress: 2 },
    { date: 'Wed', created: 2, completed: 1, inProgress: 1 },
    { date: 'Thu', created: 8, completed: 5, inProgress: 2 },
    { date: 'Fri', created: 4, completed: 2, inProgress: 1 },
    { date: 'Sat', created: 1, completed: 1, inProgress: 0 },
    { date: 'Sun', created: 3, completed: 2, inProgress: 1 },
  ];

  const tooltipStyle = {
    backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
    border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
    borderRadius: '12px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
    fontSize: '12px',
    fontWeight: '500',
  };

  const axisColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full">
      {/* Pie Chart */}
      <div className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl py-7 px-8 flex flex-col h-full">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-500 to-amber-500" />
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">Task Distribution</h3>
        </div>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value" strokeWidth={0}>
                {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4 flex-wrap">
          {pieData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl py-7 px-8 flex flex-col h-full">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-green-500" />
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">Tasks Created (Last 7 Days)</h3>
        </div>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="created" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Created" />
              <Bar dataKey="completed" fill={CHART_COLORS.success} radius={[6, 6, 0, 0]} name="Completed" />
              <Bar dataKey="inProgress" fill={CHART_COLORS.accent} radius={[6, 6, 0, 0]} name="In Progress" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Chart;
