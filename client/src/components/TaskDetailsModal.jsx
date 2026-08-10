import React, { useState, useEffect } from 'react';
import { HiOutlineCalendar, HiOutlineUserPlus, HiPlus, HiOutlineLink, HiOutlineTrash, HiXMark } from 'react-icons/hi2';
import api from '../api/axios';
import toast from 'react-hot-toast';
import SelectMembersModal from './SelectMembersModal';

const TaskDetailsModal = ({ isOpen, onClose, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Pending',
    dueDate: '',
  });

  const [checklistInput, setChecklistInput] = useState('');
  const [checklists, setChecklists] = useState([]);
  
  const [attachmentInput, setAttachmentInput] = useState('');
  const [attachments, setAttachments] = useState([]);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Low',
        status: task.status || 'Pending',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
      setChecklists(task.checklist || []);
      setAssignees(task.assignees || []);
      setAttachments(task.attachments || []);
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addChecklist = () => {
    if (checklistInput.trim()) {
      setChecklists([...checklists, { title: checklistInput.trim(), completed: false }]);
      setChecklistInput('');
    }
  };

  const toggleChecklist = (indexToToggle) => {
    setChecklists(checklists.map((item, index) => 
      index === indexToToggle ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeChecklist = (indexToRemove) => {
    setChecklists(checklists.filter((_, index) => index !== indexToRemove));
  };

  const addAttachment = () => {
    if (attachmentInput.trim()) {
      setAttachments([...attachments, attachmentInput.trim()]);
      setAttachmentInput('');
    }
  };

  const removeAttachment = (indexToRemove) => {
    setAttachments(attachments.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        checklist: checklists,
        assignees: assignees.map(a => a._id),
        attachments,
      };
      await api.put(`/tasks/${task._id}`, payload);
      toast.success('Task updated successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success('Task deleted successfully!');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete task');
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in z-[100] overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden my-auto relative animate-fade-in-up">
        
        {/* Close Button (Absolute) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <HiXMark className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between pr-16">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Update Task
          </h1>
          <button type="button" onClick={handleDelete} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-semibold transition-colors">
            <HiOutlineTrash className="w-4 h-4" />
            Delete
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Task Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Create App UI"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe task"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Grid: Priority, Due Date, Assign To */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Priority */}
            <div className="space-y-2">
                <label htmlFor="priority" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em 1.2em' }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label htmlFor="status" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em 1.2em' }}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

            {/* Due Date */}
            <div className="space-y-2">
              <label htmlFor="dueDate" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
                <HiOutlineCalendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Assign To */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Assign To
              </label>
              <div className="flex items-center gap-3 h-12">
                {assignees.length > 0 && (
                  <div className="flex -space-x-2">
                    {assignees.map((user) => (
                      <img 
                        key={user._id} 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                        alt={user.name || "Assignee"} 
                        title={user.name}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 shadow-sm"
                      />
                    ))}
                  </div>
                )}
                <button 
                  type="button" 
                  onClick={() => setIsMemberModalOpen(true)}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 border-2 border-white dark:border-slate-800 transition-colors shadow-sm shrink-0"
                >
                  <HiPlus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* TODO Checklist */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              TODO Checklist
            </label>
            {checklists.length > 0 && (
              <ul className="mb-3 space-y-3">
                {checklists.map((item, index) => (
                  <li key={index} className={`flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-700/50 group cursor-pointer transition-colors ${item.completed ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'bg-slate-50 dark:bg-slate-700/30'}`} onClick={() => toggleChecklist(index)}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={item.completed} onChange={() => {}} className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800" />
                      <span className={`text-sm font-medium ${item.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                        {item.title}
                      </span>
                    </div>
                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChecklist(index);
                      }}
                      className="text-red-400 hover:text-red-600 dark:hover:text-red-400 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-3">
              <input
                type="text"
                value={checklistInput}
                onChange={(e) => setChecklistInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addChecklist())}
                placeholder="Enter Task"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={addChecklist}
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors shrink-0"
              >
                <HiPlus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

          {/* Add Attachments */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Add Attachments
            </label>
            {attachments.length > 0 && (
              <ul className="mb-3 space-y-3">
                {attachments.map((item, index) => (
                  <li key={index} className="flex items-center justify-between text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 group">
                    <div className="flex items-center gap-2 break-all">
                      <HiOutlineLink className="w-4 h-4 shrink-0" />
                      {item}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeAttachment(index)}
                      className="text-red-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLink className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={attachmentInput}
                  onChange={(e) => setAttachmentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAttachment())}
                  placeholder="Add File Link"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={addAttachment}
                className="flex items-center gap-1.5 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold transition-colors shrink-0"
              >
                <HiPlus className="w-5 h-5" />
                Add
              </button>
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-br from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            UPDATE TASK
          </button>
        </div>
      </div>

      <SelectMembersModal 
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        selectedAssignees={assignees}
        onSave={(selected) => setAssignees(selected)}
      />
    </div>
  );
};

export default TaskDetailsModal;
