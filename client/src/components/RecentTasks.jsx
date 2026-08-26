import React, { useState, useEffect } from 'react';
import { HiArrowRight } from 'react-icons/hi2';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const getStatusStyles = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400';
    case 'In Progress':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-400';
    case 'Completed':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }
};

const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'Low':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400';
    case 'Medium':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400';
    case 'High':
      return 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400';
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }
};

const RecentTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentTasks = async () => {
      try {
        const response = await api.get('/tasks/recent-tasks');
        setTasks(response.data.recentTasks || []);
      } catch (error) {
        console.error('Error fetching recent tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentTasks();
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Recent Tasks
        </h2>
        <Link to="/tasks" className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
          See All <HiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr>
              <th className="pb-4 pr-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Name</th>
              <th className="pb-4 px-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Status</th>
              <th className="pb-4 px-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Priority</th>
              <th className="pb-4 px-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Created On</th>
              <th className="pb-4 pl-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">Loading tasks...</td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-slate-500">No recent tasks found.</td>
              </tr>
            ) : (
              tasks.map((task, index) => {
                const createdOn = task.createdAt
                  ? new Date(task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-';

                const dueDate = task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '-';

                return (
                  <tr key={task._id} className={index !== tasks.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}>
                    <td className="py-4 pr-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {task.title}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getStatusStyles(task.status)}`}>
                        {task.status || 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getPriorityStyles(task.priority)}`}>
                        {task.priority || 'Low'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {createdOn}
                    </td>
                    <td className="py-4 pl-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {dueDate}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;
