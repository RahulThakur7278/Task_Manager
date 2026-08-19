import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Chart from './common/Chart';
import RecentTasks from './common/RecentTasks';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDashboard = async () => {
      try {
        const res = await api.get('/users/dashboard');
        if (res.data?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDashboard();
  }, []);

  const stats = [
    { label: 'Total Tasks', value: data?.stats?.totalTasks ?? 0, icon: FiTrendingUp, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Pending', value: data?.stats?.pendingTasks ?? 0, icon: FiClock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Completed', value: data?.stats?.completedTasks ?? 0, icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{loading ? '...' : stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Chart */}
      <div className="mt-6 mb-8">
        <Chart barData={data?.barData} stats={data?.stats} />
      </div>

      {/* Recent Tasks */}
      <div className="mb-8">
        <RecentTasks tasks={data?.recentTasks || []} />
      </div>

      {/* Banner */}
      <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Welcome back, {user?.name || data?.user?.name || 'User'}!</h3>
        <p className="text-indigo-100 mb-6 max-w-md">
          {data?.stats?.pendingTasks ? `You have ${data.stats.pendingTasks} pending tasks for today. Keep up the great work!` : 'Check your task board for your assigned tasks.'}
        </p>
        <Link to="/user/my-tasks" className="inline-block px-6 py-2.5 rounded-lg bg-white text-indigo-600 font-semibold shadow-sm hover:bg-gray-50 transition-colors no-underline">
          View My Tasks
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
