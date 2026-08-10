import React, { useState } from 'react';
import { HiOutlineCalendar, HiOutlineUserPlus, HiPlus, HiOutlineLink } from 'react-icons/hi2';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import SelectMembersModal from '../components/SelectMembersModal';

const CreateTask = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    dueDate: '',
  });

  const [checklistInput, setChecklistInput] = useState('');
  const [checklists, setChecklists] = useState([]);
  
  const [attachmentInput, setAttachmentInput] = useState('');
  const [attachments, setAttachments] = useState([]);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [assignees, setAssignees] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addChecklist = () => {
    if (checklistInput.trim()) {
      setChecklists([...checklists, checklistInput.trim()]);
      setChecklistInput('');
    }
  };

  const addAttachment = () => {
    if (attachmentInput.trim()) {
      setAttachments([...attachments, attachmentInput.trim()]);
      setAttachmentInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      return toast.error('Task title is required');
    }

    try {
      const payload = {
        ...formData,
        checklist: checklists.map(item => ({ title: item, completed: false })),
        assignees: assignees.map(a => a._id),
        attachments,
      };

      await api.post('/tasks', payload);
      toast.success('Task created successfully!');
      navigate('/tasks'); // navigate to manage tasks
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Create Task
          </h1>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
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
              
              <div className="flex items-center gap-3 h-[50px]">
                {assignees.length > 0 && (
                  <div className="flex -space-x-2">
                    {assignees.map((user) => (
                      <img 
                        key={user._id} 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                        alt={user.name} 
                        title={user.name}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800"
                      />
                    ))}
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(true)}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors border border-transparent font-medium ${
                    assignees.length === 0 
                      ? 'w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200' 
                      : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <HiOutlineUserPlus className="w-5 h-5" />
                  {assignees.length === 0 ? 'Add Members' : 'Edit'}
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
              <ul className="mb-3 space-y-2">
                {checklists.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 px-4 py-2 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    {item}
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
              <ul className="mb-3 space-y-2">
                {attachments.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-lg break-all">
                    <HiOutlineLink className="w-4 h-4 shrink-0" />
                    {item}
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
            CREATE TASK
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

export default CreateTask;
