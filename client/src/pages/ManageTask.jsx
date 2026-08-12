import React, { useState, useEffect } from 'react';
import { HiOutlineDocumentDownload, HiOutlinePaperClip } from 'react-icons/hi';
import TaskDetailsModal from '../components/TaskDetailsModal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const ManageTask = () => {
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedTask, setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await api.get('/tasks?limit=50');
            setTasks(response.data.tasks || []);
        } catch (error) {
            toast.error('Failed to load tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task => {
        if (activeFilter === 'All') return true;
        return task.status === activeFilter;
    });

    const getStatusCounts = () => {
        const counts = { All: tasks.length, Pending: 0, 'In Progress': 0, Completed: 0 };
        tasks.forEach(t => {
            if (counts[t.status] !== undefined) {
                counts[t.status]++;
            }
        });
        return counts;
    };

    const statusCounts = getStatusCounts();

    const filters = [
        { label: 'All', count: statusCounts['All'] },
        { label: 'Pending', count: statusCounts['Pending'] },
        { label: 'In Progress', count: statusCounts['In Progress'] },
        { label: 'Completed', count: statusCounts['Completed'] },
    ];

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', border: 'border-l-purple-500', progress: 'bg-purple-500' };
            case 'In Progress': return { color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10', border: 'border-l-cyan-500', progress: 'bg-cyan-500' };
            case 'Completed': return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-l-emerald-500', progress: 'bg-emerald-500' };
            default: return { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10', border: 'border-l-slate-500', progress: 'bg-slate-500' };
        }
    };

    const getPriorityStyles = (priority) => {
        switch (priority) {
            case 'Low': return { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' };
            case 'Medium': return { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' };
            case 'High': return { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10' };
            default: return { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-50 dark:bg-slate-500/10' };
        }
    };

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
            {loading ? (
                <div className="flex justify-center py-20 text-slate-500">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="flex justify-center py-20 text-slate-500">No tasks found.</div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => {
                    const statusStyles = getStatusStyles(task.status);
                    const priorityStyles = getPriorityStyles(task.priority);
                    const completedTasks = task.checklist?.filter(c => c.completed).length || 0;
                    const totalTasks = task.checklist?.length || 0;
                    const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
                    const startDate = task.startDate ? new Date(task.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                    const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';
                    
                    return (
                    <div
                        key={task._id}
                        onClick={() => setSelectedTask(task)}
                        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border-y border-r border-slate-200 dark:border-slate-700 border-l-4 ${statusStyles.border} cursor-pointer`}
                    >
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles.bg} ${statusStyles.color}`}>
                                {task.status}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityStyles.bg} ${priorityStyles.color}`}>
                                {task.priority} Priority
                            </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                            {task.title}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                            {task.description || 'No description provided.'}
                        </p>

                        {/* Progress */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Task Done: {completedTasks} / {totalTasks}
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${statusStyles.progress}`}
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Start Date</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{startDate}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Due Date</p>
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{dueDate}</p>
                            </div>
                        </div>

                        {/* Footer: Assignees & Attachments */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex -space-x-2">
                                {task.assignees?.map((assignee, i) => (
                                    <img
                                        key={assignee._id || i}
                                        src={assignee.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(assignee.name || 'U')}`}
                                        alt={assignee.name || "Assignee"}
                                        title={assignee.name}
                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )})}
            </div>
            )}

            {/* Update Task Modal */}
            {selectedTask && (
                <TaskDetailsModal
                    isOpen={!!selectedTask}
                    onClose={() => {
                        setSelectedTask(null);
                        fetchTasks(); // refresh on close in case of updates
                    }}
                    task={selectedTask}
                />
            )}
        </div>
    );
};

export default ManageTask;