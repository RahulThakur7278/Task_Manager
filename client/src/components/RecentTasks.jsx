import React from 'react';
import { HiArrowRight } from 'react-icons/hi2';

const recentTasksData = [
  { id: 1, name: 'Develop Product Review System', status: 'Pending', priority: 'Low', createdOn: '17th Mar 2025' },
  { id: 2, name: 'Build Feedback Form Module', status: 'Pending', priority: 'High', createdOn: '17th Mar 2025' },
  { id: 3, name: 'Implement Notification System', status: 'Pending', priority: 'Low', createdOn: '17th Mar 2025' },
  { id: 4, name: 'Migrate Database to MongoDB Atlas', status: 'Completed', priority: 'Medium', createdOn: '17th Mar 2025' },
  { id: 5, name: 'Develop Expense Tracker Module', status: 'Pending', priority: 'Low', createdOn: '17th Mar 2025' },
  { id: 6, name: 'Design Homepage Banner', status: 'Pending', priority: 'Medium', createdOn: '17th Mar 2025' },
  { id: 7, name: 'Write Technical Documentation', status: 'Pending', priority: 'Medium', createdOn: '17th Mar 2025' },
  { id: 8, name: 'Setup CI/CD Pipeline', status: 'In Progress', priority: 'High', createdOn: '17th Mar 2025' },
];

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
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Recent Tasks
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
          See All <HiArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="pb-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Name</th>
              <th className="pb-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Status</th>
              <th className="pb-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Priority</th>
              <th className="pb-4 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">Created On</th>
            </tr>
          </thead>
          <tbody>
            {recentTasksData.map((task, index) => (
              <tr key={task.id} className={index !== recentTasksData.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}>
                <td className="py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {task.name}
                </td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getStatusStyles(task.status)}`}>
                    {task.status}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${getPriorityStyles(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {task.createdOn}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTasks;
