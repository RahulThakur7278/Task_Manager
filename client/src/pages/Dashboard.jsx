import { useMemo } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import StatsCard from '../components/StatsCard';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
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

  const cardStyle = {
    backgroundColor: 'var(--card-bg)',
    borderColor: 'var(--border-color)',
    boxShadow: '0 2px 8px var(--shadow-color)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
  };

  return (
    <div className="animate-fade-in">

      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          borderRadius: '20px',
          padding: '40px 36px',
          marginBottom: '32px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.07)',
          }}
        />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500 }}>
            {greeting} 👋
          </p>
          <h1 style={{ color: '#fff', fontSize: '28px', fontWeight: 700, marginTop: '4px' }}>
            {firstName}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginTop: '10px' }}>
            {totalTasks > 0
              ? `You have ${stats.pending} pending task${stats.pending !== 1 ? 's' : ''} and ${stats.completed} completed.`
              : 'No tasks yet — create your first task to get started!'}
          </p>
        </div>
      </div>

      {/* Mini Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '32px',
        }}
      >
        {miniCards.map((card, index) => (
          <MiniStatCard key={card.label} {...card} index={index} />
        ))}
      </div>

      {/* Progress Section */}
      <div style={{ marginBottom: '28px' }}>
        <StatsCard />
      </div>

      {/* Add Task Section */}
      <div
        style={{
          ...cardStyle,
          padding: '28px 32px',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div
            className="gradient-primary"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
            }}
          />
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Add New Task
          </h2>
        </div>
        <TaskForm />
      </div>

      {/* Task List Section */}
      <div
        style={{
          ...cardStyle,
          padding: '28px 32px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              className="gradient-primary"
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
              }}
            />
            <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Your Tasks
            </h2>
            {stats.total > 0 && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '2px 10px',
                  borderRadius: '20px',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  color: '#6366f1',
                }}
              >
                {stats.total}
              </span>
            )}
          </div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 1 400px', minWidth: '200px' }}>
            <SearchBar />
          </div>
          <div >
            <FilterBar />
          </div>
        </div>

        {/* Task List */}
        <TaskList />

        {/* Pagination */}
        <Pagination />
      </div>
    </div>
  );
};

export default Dashboard;
