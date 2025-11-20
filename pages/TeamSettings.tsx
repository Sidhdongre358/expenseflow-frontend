
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrgMembers, inviteMember, removeMember, updateMemberRole } from '../features/org/orgSlice';
import { Modal } from '../components/Modal';

export const TeamSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { members, activeOrg, status } = useAppSelector(state => state.orgs);
  const { profile } = useAppSelector(state => state.user);
  
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [userToRemove, setUserToRemove] = useState<string | null>(null);

  // Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Data is now fetched in App.tsx on org switch, but we can keep this to be safe
  useEffect(() => {
    if (activeOrg && members.length === 0) {
        dispatch(fetchOrgMembers());
    }
  }, [activeOrg, dispatch, members.length]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
  };

  const handleInvite = async () => {
    if (email) {
        setIsProcessing(true);
        try {
            await dispatch(inviteMember({ email, role })).unwrap();
            showToast('success', `Invitation sent to ${email}`);
            setIsInviteOpen(false);
            setEmail('');
        } catch (error) {
            showToast('error', 'Failed to send invitation');
        } finally {
            setIsProcessing(false);
        }
    }
  };

  const confirmRemoveUser = async () => {
      if (userToRemove) {
          setIsProcessing(true);
          try {
              await dispatch(removeMember(userToRemove)).unwrap();
              showToast('success', 'User removed from organization');
              setUserToRemove(null);
          } catch (error) {
              showToast('error', 'Failed to remove user');
          } finally {
              setIsProcessing(false);
          }
      }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
      try {
        await dispatch(updateMemberRole({ userId, role: newRole })).unwrap();
        showToast('success', 'User role updated');
      } catch (error) {
        showToast('error', 'Failed to update role');
      }
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
        
        {/* Toast Notification */}
        {toast && (
            <div className={`fixed top-24 right-6 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${toast.type === 'success' ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900' : 'bg-red-600 text-white'}`}>
                <span className="material-symbols-outlined">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
                <span className="font-medium text-sm">{toast.message}</span>
            </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage who has access to {activeOrg?.name}</p>
            </div>
            <button 
                onClick={() => setIsInviteOpen(true)}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium shadow-lg shadow-primary/20 hover:bg-primary-600 transition-colors flex items-center gap-2 whitespace-nowrap"
            >
                <span className="material-symbols-outlined text-lg">person_add</span>
                Invite Member
            </button>
        </div>

        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-dark/50">
                        <tr>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Joined</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
                        {members.length > 0 ? (
                            members.map(member => (
                                <tr key={member.userId} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden shrink-0">
                                                {member.avatar ? <img src={member.avatar} className="w-full h-full object-cover"/> : member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                    {member.name}
                                                    {member.userId === profile?.id && <span className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-[10px] text-gray-500">You</span>}
                                                </p>
                                                <p className="text-xs text-gray-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative inline-block">
                                            <select 
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                                                className="appearance-none bg-transparent border-none text-sm text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer capitalize py-0 pl-0 pr-6 font-medium"
                                                disabled={member.userId === profile?.id}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="member">Member</option>
                                                <option value="viewer">Viewer</option>
                                            </select>
                                            {member.userId !== profile?.id && (
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-400">
                                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${member.status === 'active' ? 'bg-green-600 dark:bg-green-400' : 'bg-yellow-600 dark:bg-yellow-400'}`}></span>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {member.userId !== profile?.id && (
                                            <button 
                                                onClick={() => setUserToRemove(member.userId)}
                                                className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                                                title="Remove User"
                                            >
                                                <span className="material-symbols-outlined text-lg group-hover:animate-pulse">delete</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No members found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Invite Modal */}
        <Modal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} title="Invite Team Member" size="sm">
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email Address</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">mail</span>
                        <input 
                            type="email" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-primary transition-shadow"
                            placeholder="colleague@company.com"
                            autoFocus
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Role</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">admin_panel_settings</span>
                        <select 
                            value={role}
                            onChange={e => setRole(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-primary appearance-none transition-shadow"
                        >
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                            <option value="viewer">Viewer</option>
                        </select>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 material-symbols-outlined text-lg">expand_more</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">Admins have full access. Members can add expenses. Viewers is read-only.</p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button onClick={() => setIsInviteOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
                    <button 
                        onClick={handleInvite} 
                        disabled={isProcessing || !email}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                         {isProcessing && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        Send Invite
                    </button>
                </div>
            </div>
        </Modal>

        {/* Remove User Confirmation Modal */}
        <Modal isOpen={!!userToRemove} onClose={() => setUserToRemove(null)} title="Remove User" size="sm">
             <div className="p-6">
                <div className="flex items-center gap-4 mb-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">
                   <span className="material-symbols-outlined text-2xl">warning</span>
                   <div>
                      <h4 className="font-semibold text-sm uppercase tracking-wide">Warning</h4>
                      <p className="text-xs opacity-90">This action is permanent</p>
                   </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Are you sure you want to remove this user from the organization? They will lose access immediately.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setUserToRemove(null)}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmRemoveUser}
                        disabled={isProcessing}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                        {isProcessing && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                        Remove User
                    </button>
                </div>
            </div>
        </Modal>
    </div>
  );
};
