import { useState, useEffect, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import api from '../api/axios';
import { CHART_COLORS } from '../utils/constants';
import { useTheme } from '../context/ThemeContext';
import {
  HiClipboardDocumentCheck,
  HiClock,
  HiChartBar,
  HiTrophy,
} from 'react-icons/hi2';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/tasks/analytics');
        setAnalytics(data.analytics);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const pieData = useMemo(() => {
    if (!analytics) return [];
    return [
      { name: 'Completed', value: analytics.completed, color: CHART_COLORS.success },
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl animate-pulse-soft" style={{ backgroundColor: 'var(--hover-bg)' }} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-2xl animate-pulse-soft" style={{ backgroundColor: 'var(--hover-bg)' }} />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p style={{ color: 'var(--text-muted)' }}>Failed to load analytics</p>
      </div>
    );
  }

  const summaryCards = [
    {
      label: 'Total Tasks',
      value: analytics.total,
      icon: HiChartBar,
      color: CHART_COLORS.primary,
      bg: 'rgba(99, 102, 241, 0.1)',
    },
    {
      label: 'Completed',
      value: analytics.completed,
      icon: HiClipboardDocumentCheck,
      color: CHART_COLORS.success,
      bg: 'rgba(34, 197, 94, 0.1)',
    },
    {
      label: 'Pending',
      value: analytics.pending,
      icon: HiClock,
      color: CHART_COLORS.warning,
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      label: 'Completion Rate',
      value: `${analytics.completionRate}%`,
      icon: HiTrophy,
      color: CHART_COLORS.accent,
      bg: 'rgba(6, 182, 212, 0.1)',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Track your productivity and task completion trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {summaryCards.map((card, index) => (
          <div
            key={card.label}
            className="rounded-2xl p-5 border transition-all duration-300 hover:shadow-lg animate-fade-in-up"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 3px var(--shadow-color)',
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: card.bg }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {card.value}
            </p>
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)',
          }}
        >
          <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Task Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={6}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)',
          }}
        >
          <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Tasks Created (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="created" fill={CHART_COLORS.primary} radius={[6, 6, 0, 0]} name="Created" />
                <Bar dataKey="completed" fill={CHART_COLORS.success} radius={[6, 6, 0, 0]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart - spans full width */}
        <div
          className="rounded-2xl p-6 border lg:col-span-2"
          style={{
            backgroundColor: 'var(--card-bg)',
            borderColor: 'var(--border-color)',
            boxShadow: '0 1px 3px var(--shadow-color)',
          }}
        >
          <h3 className="text-sm font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>
            Completion Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={barData}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke={CHART_COLORS.primary}
                  fill="url(#colorCreated)"
                  strokeWidth={2}
                  name="Created"
                />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke={CHART_COLORS.success}
                  fill="url(#colorCompleted)"
                  strokeWidth={2}
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
