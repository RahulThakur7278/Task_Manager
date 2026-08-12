import React, { useState, useEffect } from 'react';
import { HiXMark, HiMagnifyingGlass } from 'react-icons/hi2';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SelectMembersModal = ({ isOpen, onClose, selectedAssignees, onSave }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Local state for the modal's selections before saving
  const [localSelected, setLocalSelected] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setLocalSelected([...selectedAssignees]);
      fetchUsers();
    }
  }, [isOpen, selectedAssignees]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (user) => {
    const isSelected = localSelected.some((u) => u._id === user._id);
    if (isSelected) {
      setLocalSelected(localSelected.filter((u) => u._id !== user._id));
    } else {
      setLocalSelected([...localSelected, user]);
    }
  };

  const handleSave = () => {
    onSave(localSelected);
    onClose();
  };

  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-fade-in z-[110]">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fade-in-up flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Add Members
          </h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
          {loading ? (
            <div className="py-10 text-center text-slate-500">Loading members...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="py-10 text-center text-slate-500">No members found.</div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = localSelected.some((u) => u._id === user._id);
                return (
                  <div 
                    key={user._id}
                    onClick={() => toggleUser(user)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-indigo-50/50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30' : 'bg-white dark:bg-slate-800 border-transparent hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                  >
                    <div className="relative shrink-0">
                      <img 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} 
                        alt={user.name} 
                        className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>
                    <div className="shrink-0">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 border-indigo-500' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'}`}>
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 shrink-0 bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={handleSave}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-white bg-indigo-500 hover:bg-indigo-600 shadow-sm transition-all"
          >
            Save Selection ({localSelected.length})
          </button>
        </div>

      </div>
    </div>
  );
};

export default SelectMembersModal;
