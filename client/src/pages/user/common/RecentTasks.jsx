import React from 'react';
import { FiClock, FiCheckCircle, FiMoreVertical } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const RecentTasks = ({ tasks = [] }) => {
  const displayTasks = tasks.length > 0 ? tasks : [
    { _id: 1, title: 'Update User Profile UI', status: 'In Progress', createdAt: '2026-08-18' },
    { _id: 2, title: 'Fix Database Connection', status: 'Completed', createdAt: '2026-08-18' },
    { _id: 3, title: 'Write API Documentation', status: 'Pending', createdAt: '2026-08-18' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
        <Link to="/user/my-tasks" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {displayTasks.map(task => (
          <div key={task._id || task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'}`}>
                {task.status === 'Completed' ? <FiCheckCircle /> : <FiClock />}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : task.time || 'Recently'}
                </p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              task.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
              'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}>
              {task.priority || task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;
