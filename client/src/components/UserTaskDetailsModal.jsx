import React, { useState, useEffect } from 'react';
import { 
  FiX, 
  FiClock, 
  FiCalendar, 
  FiUser, 
  FiUsers, 
  FiCheckSquare, 
  FiSquare, 
  FiPaperclip, 
  FiFileText, 
  FiTag, 
  FiAlertCircle, 
  FiExternalLink,
  FiCheckCircle,
  FiSave,
  FiRefreshCw
} from 'react-icons/fi';
import api from '../api/axios';
import toast from 'react-hot-toast';

const UserTaskDetailsModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [localStatus, setLocalStatus] = useState('Pending');
  const [localChecklist, setLocalChecklist] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setLocalStatus(task.status || 'Pending');
      setLocalChecklist(task.checklist ? JSON.parse(JSON.stringify(task.checklist)) : []);
    }
  }, [task, isOpen]);

  if (!isOpen || !task) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': 
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'In Progress': 
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      default: 
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High': 
        return 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border-red-200 dark:border-red-900';
      case 'Medium': 
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-900';
      default: 
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleStatusChange = (newStatus) => {
    setLocalStatus(newStatus);
  };

  const handleToggleChecklist = (indexToToggle) => {
    setLocalChecklist(prev => prev.map((item, idx) => 
      idx === indexToToggle ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const payload = {
        status: localStatus,
        checklist: localChecklist,
      };

      await api.put(`/tasks/${task._id}`, payload);
      toast.success('Task details updated successfully');
      if (onTaskUpdated) onTaskUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to save task updates:', err);
      toast.error(err.response?.data?.message || 'Failed to save task details');
    } finally {
      setSaving(false);
    }
  };

  // Calculate checklist progress
  const totalChecklist = localChecklist.length;
  const completedChecklist = localChecklist.filter(c => c.completed).length;
  const progressPercent = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0;

  // Check if modified
  const isModified = localStatus !== task.status || JSON.stringify(localChecklist) !== JSON.stringify(task.checklist || []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="space-y-2 pr-6">
            <div className="flex flex-wrap items-center gap-2">
              {/* Priority Tag */}
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(task.priority)}`}>
                {task.priority || 'Medium'} Priority
              </span>

              {/* Status Select Badge */}
              <div className="relative inline-block">
                <select
                  value={localStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={saving}
                  className={`appearance-none px-3 py-0.5 pr-6 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none transition-all ${getStatusColor(localStatus)}`}
                >
                  <option value="Pending" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">Pending</option>
                  <option value="In Progress" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">In Progress</option>
                  <option value="Completed" className="bg-white text-slate-800 dark:bg-slate-800 dark:text-white">Completed</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs opacity-60">
                  ▼
                </div>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={saving}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1 text-slate-700 dark:text-slate-300">
          
          {/* Metadata Grid (Dates & Assignees) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            {/* Start Date */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Start Date</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {task.startDate ? new Date(task.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not specified'}
                </p>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                <FiClock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Due Date</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'No due date'}
                </p>
              </div>
            </div>

            {/* Created By */}
            {task.user && (
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400">
                  <FiUser className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Created By</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.user.avatar ? (
                      <img src={task.user.avatar} alt={task.user.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : null}
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {task.user.name || task.user.email || 'Admin'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Assignees */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
                <FiUsers className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Assigned To</p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  {task.assignees && task.assignees.length > 0 ? (
                    task.assignees.map((assignee, idx) => (
                      <div key={assignee._id || idx} className="flex items-center gap-1 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-md text-xs border border-slate-200 dark:border-slate-600">
                        {assignee.avatar ? (
                          <img src={assignee.avatar} alt={assignee.name} className="w-4 h-4 rounded-full object-cover" />
                        ) : null}
                        <span className="font-medium text-slate-700 dark:text-slate-200">{assignee.name || assignee.email}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Unassigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Task Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FiFileText className="text-indigo-500" />
              Description
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line min-h-[70px]">
              {task.description ? task.description : (
                <span className="italic text-slate-400 dark:text-slate-500">No description provided for this task.</span>
              )}
            </div>
          </div>

          {/* Checklist Section */}
          {totalChecklist > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FiCheckSquare className="text-indigo-500" />
                  Checklist ({completedChecklist}/{totalChecklist})
                </h3>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {progressPercent}% completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-2 pt-1">
                {localChecklist.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleToggleChecklist(idx)}
                    disabled={saving}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left text-sm transition-colors ${
                      item.completed 
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-slate-500 dark:text-slate-400 line-through'
                        : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600'
                    }`}
                  >
                    {item.completed ? (
                      <FiCheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <FiSquare className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span>{item.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Section */}
          {task.attachments && task.attachments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FiPaperclip className="text-indigo-500" />
                Attachments ({task.attachments.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {task.attachments.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors text-sm text-slate-700 dark:text-slate-200 truncate group"
                  >
                    <FiPaperclip className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                    <span className="truncate flex-1 font-medium">{url.replace(/^https?:\/\//, '')}</span>
                    <FiExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Footer Timestamps */}
          <div className="pt-2 flex flex-wrap justify-between items-center text-xs text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800 gap-2">
            <div>
              <span>Created: {task.createdAt ? new Date(task.createdAt).toLocaleString() : 'N/A'}</span>
            </div>
            {task.updatedAt && (
              <div>
                <span>Updated: {new Date(task.updatedAt).toLocaleString()}</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 shadow-md ${
              isModified
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserTaskDetailsModal;

