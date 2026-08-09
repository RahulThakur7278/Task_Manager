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

import MiniStatCard from '../components/MiniStatCard';

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

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 2px 8px var(--shadow-color)',
    borderRadius: '16px',
  };

  if (loading) {
    return (
      <div className="animate-fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} style={{ height: '112px', borderRadius: '16px', backgroundColor: 'var(--hover-bg)' }} className="animate-pulse-soft" />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ height: '320px', borderRadius: '16px', backgroundColor: 'var(--hover-bg)' }} className="animate-pulse-soft" />
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <p style={{ color: 'var(--text-muted)' }}>Failed to load analytics</p>
      </div>
    );
  }

  const summaryCards = [
    { label: 'Total Tasks', value: analytics.total, icon: HiChartBar, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { label: 'Completed', value: analytics.completed, icon: HiClipboardDocumentCheck, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
    { label: 'Pending', value: analytics.pending, icon: HiClock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Completion Rate', value: `${analytics.completionRate}%`, icon: HiTrophy, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  ];

  return (
    <div className="animate-fade-in">

      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%)',
          borderRadius: '20px',
          padding: '40px 36px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700 }}>Analytics</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '10px' }}>
            Track your productivity and task completion trends
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {summaryCards.map((card, index) => (
          <MiniStatCard key={card.label} {...card} index={index} />
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pie Chart */}
        <div className="hover:shadow-lg transition-all duration-300" style={{ ...cardStyle, padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #f59e0b)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Task Distribution</h3>
          </div>
          <div style={{ height: '256px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={6} dataKey="value" strokeWidth={0}>
                  {pieData.map((entry, index) => (<Cell key={index} fill={entry.color} />))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
            {pieData.map((entry) => (
              <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: entry.color }} />
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart */}
        <div className="hover:shadow-lg transition-all duration-300" style={{ ...cardStyle, padding: '28px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #22c55e)' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Tasks Created (Last 7 Days)</h3>
          </div>
          <div style={{ height: '256px' }}>
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

        {/* Area Chart - full width */}
        <div className="hover:shadow-lg transition-all duration-300" style={{ ...cardStyle, padding: '28px 32px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div className="gradient-primary" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Completion Trend</h3>
          </div>
          <div style={{ height: '256px' }}>
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
                <Area type="monotone" dataKey="created" stroke={CHART_COLORS.primary} fill="url(#colorCreated)" strokeWidth={2} name="Created" />
                <Area type="monotone" dataKey="completed" stroke={CHART_COLORS.success} fill="url(#colorCompleted)" strokeWidth={2} name="Completed" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
