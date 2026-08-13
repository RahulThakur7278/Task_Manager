import React, { useState, useEffect } from 'react';
import { HiPlus, HiPencil } from 'react-icons/hi';
import AddMemberModal from '../components/AddMemberModal';
import EditMemberModal from '../components/EditMemberModal';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Team = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const getInitials = (fullName) => {
    if (!fullName) return '';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/users');
      setTeamMembers(response.data.users);
    } catch {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Team Members
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-gradient-to-br from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 rounded-lg shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-300 shrink-0"
          >
            <HiPlus className="w-5 h-5" />
            Add Member
          </button>

        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20 text-slate-500">Loading team members...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamMembers.map(member => (
            <div key={member._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            {/* Header info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-bold text-sm">
                    {getInitials(member.name)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{member.name}</h3>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${
                      member.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                        : 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800'
                    }`}>
                      {member.role || 'user'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{member.email}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingMember(member);
                  setIsEditModalOpen(true);
                }}
                className="text-slate-400 hover:text-indigo-500 transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
                title="Edit Member"
              >
                <HiPencil className="w-5 h-5" />
              </button>
            </div>
            {/* Stats row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex flex-col items-center flex-1">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{member.pending}</span>
                <span className="text-xs font-semibold text-purple-600/70 dark:text-purple-400/70">Pending</span>
              </div>
              <div className="flex flex-col items-center flex-1 border-l border-slate-100 dark:border-slate-700/50">
                <span className="text-lg font-bold text-cyan-500 dark:text-cyan-400">{member.inProgress}</span>
                <span className="text-xs font-semibold text-cyan-500/70 dark:text-cyan-400/70">In Progress</span>
              </div>
              <div className="flex flex-col items-center flex-1 border-l border-slate-100 dark:border-slate-700/50">
                <span className="text-lg font-bold text-indigo-500 dark:text-indigo-400">{member.completed}</span>
                <span className="text-xs font-semibold text-indigo-500/70 dark:text-indigo-400/70">Completed</span>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
      
      {/* Add Member Modal */}
      <AddMemberModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onMemberAdded={fetchTeamMembers}
      />

      {/* Edit Member Modal */}
      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
        }}
        member={editingMember}
        onMemberUpdated={fetchTeamMembers}
      />
    </div>
  );
};

export default Team;
