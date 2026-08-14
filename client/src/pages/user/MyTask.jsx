import React from 'react';
import { FiClock, FiMoreVertical } from 'react-icons/fi';

const MyTask = () => {
  const tasks = [
    { id: 1, title: 'Design Landing Page', status: 'In Progress', priority: 'High', date: 'Aug 15, 2026' },
    { id: 2, title: 'Implement Auth Flow', status: 'Pending', priority: 'Medium', date: 'Aug 16, 2026' },
    { id: 3, title: 'Fix Navigation Bug', status: 'Completed', priority: 'High', date: 'Aug 14, 2026' },
    { id: 4, title: 'Write API Documentation', status: 'Pending', priority: 'Low', date: 'Aug 18, 2026' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'In Progress': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Tasks</h2>
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-sm">
          Filter Tasks
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Task Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Priority</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Due Date</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900 dark:text-white">{task.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.priority}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1.5">
                      <FiClock /> {task.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyTask;
