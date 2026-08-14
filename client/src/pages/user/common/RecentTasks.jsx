import React from 'react';
import { FiClock, FiCheckCircle, FiMoreVertical } from 'react-icons/fi';

const RecentTasks = () => {
  const tasks = [
    { id: 1, title: 'Update User Profile UI', status: 'In Progress', time: '2 hours ago' },
    { id: 2, title: 'Fix Database Connection', status: 'Completed', time: '5 hours ago' },
    { id: 3, title: 'Write API Documentation', status: 'Pending', time: '1 day ago' },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">View All</button>
      </div>
      
      <div className="space-y-4">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-full ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30' : task.status === 'In Progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30'}`}>
                {task.status === 'Completed' ? <FiCheckCircle /> : <FiClock />}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.time}</p>
              </div>
            </div>
            <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
              <FiMoreVertical />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTasks;
