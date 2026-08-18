import React from 'react';
import { FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import Chart from './common/Chart';
import RecentTasks from './common/RecentTasks';

const Dashboard = () => {
  const stats = [
    { label: 'Total Tasks', value: '24', icon: FiTrendingUp, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Pending', value: '8', icon: FiClock, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
    { label: 'Completed', value: '16', icon: FiCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
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
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Chart */}
      <div className="mt-6 mb-8">
        <Chart />
      </div>

      {/* Recent Tasks */}
      <div className="mb-8">
        <RecentTasks />
      </div>

      {/* Banner */}
      <div className="mt-8 p-8 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg">
        <h3 className="text-2xl font-bold mb-2">Welcome back, User!</h3>
        <p className="text-indigo-100 mb-6 max-w-md">You have 8 pending tasks for today. Keep up the great work and stay productive.</p>
        <button className="px-6 py-2.5 rounded-lg bg-white text-indigo-600 font-semibold shadow-sm hover:bg-gray-50 transition-colors">
          View My Tasks
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
