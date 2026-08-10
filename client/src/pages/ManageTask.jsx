import React, { useState } from 'react';
import { HiOutlineDocumentDownload, HiOutlinePaperClip } from 'react-icons/hi';
import TaskDetailsModal from '../components/TaskDetailsModal';

const mockTasks = [
    {
        id: 1,
        title: 'Design Homepage',
        description: 'Create a clean and modern homepage layout using Tailwind CSS. Ensure the design is responsive and...',
        status: 'In Progress',
        priority: 'High Priority',
        completedTasks: 2,
        totalTasks: 5,
        startDate: '16th Mar 2025',
        dueDate: '31st Mar 2025',
        assignees: ['https://i.pravatar.cc/150?img=1', 'https://i.pravatar.cc/150?img=2', 'https://i.pravatar.cc/150?img=3'],
        attachments: 2,
        statusColor: 'text-cyan-600 dark:text-cyan-400',
        statusBg: 'bg-cyan-50 dark:bg-cyan-500/10',
        borderColor: 'border-l-cyan-500',
        progressColor: 'bg-cyan-500',
        priorityColor: 'text-red-600 dark:text-red-400',
        priorityBg: 'bg-red-50 dark:bg-red-500/10'
    },
    {
        id: 2,
        title: 'Write Blog Post',
        description: 'Write an informative blog post about React performance optimization. Cover techniques like memoization, lazy...',
        status: 'In Progress',
        priority: 'Medium Priority',
        completedTasks: 2,
        totalTasks: 5,
        startDate: '16th Mar 2025',
        dueDate: '27th Mar 2025',
        assignees: ['https://i.pravatar.cc/150?img=4', 'https://i.pravatar.cc/150?img=5', 'https://i.pravatar.cc/150?img=6'],
        attachments: 0,
        statusColor: 'text-cyan-600 dark:text-cyan-400',
        statusBg: 'bg-cyan-50 dark:bg-cyan-500/10',
        borderColor: 'border-l-cyan-500',
        progressColor: 'bg-cyan-500',
        priorityColor: 'text-amber-600 dark:text-amber-400',
        priorityBg: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
        id: 3,
        title: 'API Integration for Dashboard',
        description: 'Implement API integration for the user dashboard. Ensure data fetching is efficient and includes proper error...',
        status: 'Pending',
        priority: 'High Priority',
        completedTasks: 0,
        totalTasks: 5,
        startDate: '16th Mar 2025',
        dueDate: '5th Apr 2025',
        assignees: ['https://i.pravatar.cc/150?img=7', 'https://i.pravatar.cc/150?img=8', 'https://i.pravatar.cc/150?img=9'],
        attachments: 0,
        statusColor: 'text-purple-600 dark:text-purple-400',
        statusBg: 'bg-purple-50 dark:bg-purple-500/10',
        borderColor: 'border-l-purple-500',
        progressColor: 'bg-purple-500',
        priorityColor: 'text-red-600 dark:text-red-400',
        priorityBg: 'bg-red-50 dark:bg-red-500/10'
    },
    {
        id: 4,
        title: 'Product Catalog Update',
        description: 'Update the product catalog with new categories and revised listings. Ensure descriptions are concise yet...',
        status: 'Pending',
        priority: 'Low Priority',
        completedTasks: 0,
        totalTasks: 5,
        startDate: '16th Mar 2025',
        dueDate: '8th Apr 2025',
        assignees: ['https://i.pravatar.cc/150?img=10', 'https://i.pravatar.cc/150?img=11'],
        attachments: 0,
        statusColor: 'text-purple-600 dark:text-purple-400',
        statusBg: 'bg-purple-50 dark:bg-purple-500/10',
        borderColor: 'border-l-purple-500',
        progressColor: 'bg-purple-500',
        priorityColor: 'text-emerald-600 dark:text-emerald-400',
        priorityBg: 'bg-emerald-50 dark:bg-emerald-500/10'
    },
    {
        id: 5,
        title: 'Social Media Campaign',
        description: 'Develop a content plan for the upcoming product launch. Create visually appealing designs with engagin...',
        status: 'Pending',
        priority: 'Medium Priority',
        completedTasks: 0,
        totalTasks: 3,
        startDate: '16th Mar 2025',
        dueDate: '12th Apr 2025',
        assignees: ['https://i.pravatar.cc/150?img=12'],
        attachments: 0,
        statusColor: 'text-purple-600 dark:text-purple-400',
        statusBg: 'bg-purple-50 dark:bg-purple-500/10',
        borderColor: 'border-l-purple-500',
        progressColor: 'bg-purple-500',
        priorityColor: 'text-amber-600 dark:text-amber-400',
        priorityBg: 'bg-amber-50 dark:bg-amber-500/10'
    },
    {
        id: 6,
        title: 'Develop Authentication System',
        description: 'Implement secure authentication for the platform. Include features like user registration, login, and...',
        status: 'Pending',
        priority: 'High Priority',
        completedTasks: 0,
        totalTasks: 5,
        startDate: '16th Mar 2025',
        dueDate: '30th Apr 2025',
        assignees: ['https://i.pravatar.cc/150?img=13', 'https://i.pravatar.cc/150?img=14'],
        attachments: 0,
        statusColor: 'text-purple-600 dark:text-purple-400',
        statusBg: 'bg-purple-50 dark:bg-purple-500/10',
        borderColor: 'border-l-purple-500',
        progressColor: 'bg-purple-500',
        priorityColor: 'text-red-600 dark:text-red-400',
        priorityBg: 'bg-red-50 dark:bg-red-500/10'
    }
];

const ManageTask = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);

    const filters = [
        { label: 'All', count: 18 },
        { label: 'Pending', count: 11 },
        { label: 'In Progress', count: 5 },
        { label: 'Completed', count: 2 },
    ];

    return (
        <div className="w-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    My Tasks
                </h1>

                <div className="flex items-center gap-4 flex-wrap">
                    {/* Filters */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                        {filters.map((filter) => (
                            <button
                                key={filter.label}
                                onClick={() => setActiveFilter(filter.label)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeFilter === filter.label
                                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-none pb-1'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                                    }`}
                            >
                                {filter.label}
                                <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === filter.label
                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                    {filter.count}
                                </span>
                            </button>
                        ))}
                    </div>


                </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockTasks.map((task) => (
                    <div
                        key={task.id}
                        onClick={() => setSelectedTask(task)}
                        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border-y border-r border-slate-200 dark:border-slate-700 border-l-4 ${task.borderColor} cursor-pointer`}
                    >
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.statusBg} ${task.statusColor}`}>
                                {task.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.priorityBg} ${task.priorityColor}`}>
                                {task.priority}
                            </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {task.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                            {task.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Task Done: {task.completedTasks} / {task.totalTasks}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${task.progressColor}`}
                                    style={{ width: `${(task.completedTasks / task.totalTasks) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Start Date</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{task.startDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Due Date</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{task.dueDate}</p>
                            </div>
                        </div>

                        {/* Footer: Assignees & Attachments */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex -space-x-2">
                                {task.assignees.map((avatar, i) => (
                                    <img
                                        key={i}
                                        src={avatar}
                                        alt="Assignee"
                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                                    />
                                ))}
                            </div>
                            {task.attachments > 0 && (
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                    <HiOutlinePaperClip className="w-3.5 h-3.5" />
                                    {task.attachments}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Update Task Modal */}
            <TaskDetailsModal
                isOpen={!!selectedTask}
                onClose={() => setSelectedTask(null)}
                task={selectedTask}
            />
        </div>
    );
};

export default ManageTask;