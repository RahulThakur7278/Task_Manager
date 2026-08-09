import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useTasks } from '../context/TaskContext';
import { CHART_COLORS } from '../utils/constants';

const StatsCard = () => {
  const { totalTasks, tasks } = useTasks();

  const stats = useMemo(() => {
    // Count based on current total (server-side count) and visible completed
    // For accuracy, we'll use tasks from current page as a fallback
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = tasks.filter((t) => !t.completed).length;

    return {
      completed: completedCount,
      pending: pendingCount,
      total: completedCount + pendingCount,
      rate: completedCount + pendingCount > 0
        ? Math.round((completedCount / (completedCount + pendingCount)) * 100)
        : 0,
    };
  }, [tasks]);

  const chartData = useMemo(() => [
    { name: 'Completed', value: stats.completed || 0 },
    { name: 'Pending', value: stats.pending || 0 },
  ], [stats]);

  const colors = [CHART_COLORS.success, CHART_COLORS.warning];

  return (
    <div
      className="rounded-2xl p-5 border transition-all duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 1px 3px var(--shadow-color)',
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            Task Progress
          </p>
          <p className="text-3xl font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
            {stats.rate}%
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--color-success-500)' }}>{stats.completed} done</span>
            {' · '}
            <span style={{ color: 'var(--color-warning-500)' }}>{stats.pending} pending</span>
          </p>
        </div>

        <div className="w-20 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={22}
                outerRadius={35}
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

      {/* Progress bar */}
      <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--hover-bg)' }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${stats.rate}%`,
            background: `linear-gradient(90deg, ${CHART_COLORS.success}, ${CHART_COLORS.accent})`,
          }}
        />
      </div>
    </div>
  );
};

export default StatsCard;
