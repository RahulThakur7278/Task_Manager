import React, { useState, useEffect } from 'react';
import { HiXMark, HiOutlineUser, HiOutlinePhone, HiOutlineEnvelope, HiOutlineLockClosed, HiEye, HiEyeSlash } from 'react-icons/hi2';
import api from '../api/axios';
import toast from 'react-hot-toast';

const EditMemberModal = ({ isOpen, onClose, member, onMemberUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        name: member.name || '',
        phone: member.phone || '',
        email: member.email || '',
        password: '', // Do not show the old password
      });
    }
  }, [member]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
      };
      // Only include password if a new one was entered
      if (formData.password) {
        payload.password = formData.password;
      }
      
      await api.patch(`/users/updates/${member._id}`, payload);
      toast.success('Team member updated successfully!');
      if (onMemberUpdated) onMemberUpdated();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update member');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in z-[100]">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <HiXMark className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Edit Team Member
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Update account details for your team member.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
          {/* Name */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineUser className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlinePhone className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Email (Read Only) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Email Address (Cannot be changed)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineEnvelope className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              New Password (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <HiOutlineLockClosed className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep unchanged"
                className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-indigo-500 transition-colors"
              >
                {showPassword ? (
                  <HiEyeSlash className="h-5 w-5" />
                ) : (
                  <HiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-br from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 mt-6"
          >
            UPDATE MEMBER
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;
