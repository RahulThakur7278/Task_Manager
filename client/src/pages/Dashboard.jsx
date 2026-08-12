import { useMemo, useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import StatsCard from '../components/StatsCard';
import RecentTasks from '../components/RecentTasks';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { CHART_COLORS } from '../utils/constants';
import api from '../api/axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import {
  HiClipboardDocumentCheck,
  HiClock,
  HiChartBar,
  HiTrophy,
} from 'react-icons/hi2';

import MiniStatCard from '../components/MiniStatCard';

const Dashboard = () => {
  const { totalTasks, tasks } = useTasks();
  const { user } = useAuth();

  const stats = useMemo(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;
    const total = completedCount + pendingCount;
    const rate = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    return { completed: completedCount, pending: pendingCount, total, rate };
  }, [tasks]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'there';

  const miniCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: HiChartBar,
      color: '#6366f1',
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: HiClipboardDocumentCheck,
      color: '#22c55e',
      bg: 'rgba(34, 197, 94, 0.1)',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: HiClock,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Done Rate',
      value: `${stats.rate}%`,
      icon: HiTrophy,
      color: '#06b6d4',
      bg: 'rgba(6, 182, 212, 0.1)',
    },
  ];


  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/tasks/analytics');
        setAnalytics(data.analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoadingAnalytics(false);
      }
    };
    fetchAnalytics();
  }, []);

  const pieData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: 'Completed', value: analytics.completed, color: CHART_COLORS.success },
      { name: 'In Progress', value: analytics.inProgress, color: CHART_COLORS.accent },
      { name: 'Pending', value: analytics.pending, color: CHART_COLORS.warning },
    ];
  }, [analytics]);

  const barData = useMemo(() => {
    if (!analytics) return [];
    return analytics.dailyStats.map((day) => ({
      ...day,
      date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
    }));
  }, [analytics]);

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

  const summaryCards = [
    { label: 'Total Tasks', value: analytics?.total || 0, icon: HiChartBar, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Completed', value: analytics?.completed || 0, icon: HiClipboardDocumentCheck, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending', value: analytics?.pending || 0, icon: HiClock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Completion Rate', value: `${analytics?.completionRate || 0}%`, icon: HiTrophy, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  ];

  return (
    <div className="animate-fade-in">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-[20px] px-9 py-10 mb-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="absolute bottom-[-30px] left-[-30px] w-[120px] h-[120px] rounded-full bg-white/[0.07]" />

        <div className="relative z-10">
          <p className="text-white/80 text-sm font-medium">
            {greeting} 👋
          </p>
          <h1 className="text-white text-[28px] font-bold mt-1">
            {firstName}
          </h1>
          <p className="text-white/70 text-sm mt-2.5">
            {totalTasks > 0
              ? `You have ${stats.pending} pending task${stats.pending !== 1 ? 's' : ''} and ${stats.completed} completed.`
              : 'No tasks yet — create your first task to get started!'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {summaryCards.map((card, index) => (
          <MiniStatCard key={card.label} {...card} index={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl py-7 px-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-green-500 to-amber-500" />
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">Task Distribution</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
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
        <div className="hover:shadow-lg transition-all duration-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl py-7 px-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-green-500" />
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-slate-100">Tasks Created (Last 7 Days)</h3>
          </div>
          <div className="h-64">
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


      {/* Recent Tasks Section */}
      <RecentTasks />
    </div>
  );
};

export default Dashboard;
