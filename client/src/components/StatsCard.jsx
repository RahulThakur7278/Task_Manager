import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTasks } from '../context/TaskContext';
import { CHART_COLORS } from '../utils/constants';

const StatsCard = () => {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;
    const total = completedCount + pendingCount;
    return {
      completed: completedCount,
      pending: pendingCount,
      total,
      rate: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    };
  }, [tasks]);

  const chartData = useMemo(() => [
    { name: 'Completed', value: stats.completed || 0 },
    { name: 'Pending', value: stats.pending || 0 },
  ], [stats]);

  const colors = [CHART_COLORS.success, CHART_COLORS.warning];

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        boxShadow: '0 2px 8px var(--shadow-color)',
        borderRadius: '16px',
        padding: '28px 32px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
          }}
        />
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
          Task Progress
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
        {/* Left: Stats */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '6px' }}>
            <p style={{ fontSize: '40px', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1 }}>
              {stats.rate}%
            </p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', margin: 0, paddingBottom: '4px' }}>
              complete
            </p>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 0 0' }}>
            <span style={{ color: 'var(--color-success-500)', fontWeight: 500 }}>
              {stats.completed} done
            </span>
            {' · '}
            <span style={{ color: 'var(--color-warning-500)', fontWeight: 500 }}>
              {stats.pending} pending
            </span>
          </p>

          {/* Progress bar */}
          <div
            style={{
              marginTop: '20px',
              height: '8px',
              borderRadius: '999px',
              overflow: 'hidden',
              backgroundColor: 'var(--hover-bg)',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '999px',
                width: `${stats.rate}%`,
                background: `linear-gradient(90deg, ${CHART_COLORS.success}, ${CHART_COLORS.accent})`,
                transition: 'width 0.7s ease-out',
              }}
            />
          </div>
        </div>

        {/* Right: Mini pie */}
        <div style={{ width: '80px', height: '80px', flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={24}
                outerRadius={36}
                paddingAngle={4}
                dataKey="value"
                strokeWidth={0}
              >
                {chartData.map((_, index) => (
                  <Cell key={index} fill={colors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
