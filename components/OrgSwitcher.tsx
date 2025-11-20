
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setActiveOrg, createOrganization } from '../features/org/orgSlice';
import { fetchExpenses } from '../features/expenses/expensesSlice';
import { fetchBudgets } from '../features/budgets/budgetsSlice';
import { fetchNotifications } from '../features/notifications/notificationsSlice';
import { setCurrency } from '../features/ui/uiSlice';
import { Modal } from './Modal';

const ORG_COLORS = [
    { name: 'Blue', value: 'bg-blue-600' },
    { name: 'Purple', value: 'bg-purple-600' },
    { name: 'Indigo', value: 'bg-indigo-600' },
    { name: 'Green', value: 'bg-green-600' },
    { name: 'Orange', value: 'bg-orange-600' },
    { name: 'Red', value: 'bg-red-600' },
    { name: 'Black', value: 'bg-gray-900' },
];

export const OrgSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const { myOrgs, activeOrgId, activeOrg } = useAppSelector(state => state.orgs);
  const [isOpen, setIsOpen] = useState(false);
  
  // Create Org States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgSlug, setNewOrgSlug] = useState('');
  const [selectedColor, setSelectedColor] = useState(ORG_COLORS[0].value);
  const [industry, setIndustry] = useState('Technology');
  const [isCreating, setIsCreating] = useState(false);

  const handleSwitch = (orgId: string) => {
    const org = myOrgs.find(o => o.id === orgId);
    if (org) {
        dispatch(setActiveOrg(orgId));
        dispatch(setCurrency(org.currency)); 
        
        setTimeout(() => {
            dispatch(fetchExpenses());
            dispatch(fetchBudgets());
            dispatch(fetchNotifications());
        }, 50);
    }
    setIsOpen(false);
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newOrgName || !newOrgSlug) return;
    
    setIsCreating(true);
    try {
        // In a real app, we would save the color and industry too
        await dispatch(createOrganization({ name: newOrgName, slug: newOrgSlug })).unwrap();
        setIsCreateOpen(false);
        setNewOrgName('');
        setNewOrgSlug('');
        setSelectedColor(ORG_COLORS[0].value);
        // Also refresh data for new org
        setTimeout(() => {
            dispatch(fetchExpenses());
            dispatch(fetchBudgets());
            dispatch(fetchNotifications());
        }, 50);
    } catch (error) {
        console.error('Failed to create org', error);
    } finally {
        setIsCreating(false);
    }
  };

  const initials = activeOrg?.name.substring(0, 2).toUpperCase() || 'OR';

  return (
    <div className="relative px-2 mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group"
      >
        <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
            {activeOrg?.logo ? <img src={activeOrg.logo} alt="Logo" className="w-full h-full object-cover rounded-lg"/> : initials}
        </div>
        <div className="flex-1 text-left overflow-hidden">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white truncate">{activeOrg?.name || 'Select Org'}</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center gap-1">
            {activeOrg?.plan} Plan 
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
            <span className="text-[10px] uppercase">Active</span>
          </p>
        </div>
        <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">unfold_more</span>
      </button>

      {isOpen && (
        <>
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
            <div className="absolute top-full left-2 right-2 mt-2 bg-white dark:bg-[#1c2431] rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">My Organizations</div>
                <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
                    {myOrgs.map(org => (
                        <button 
                            key={org.id}
                            onClick={() => handleSwitch(org.id)}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${activeOrgId === org.id ? 'bg-primary/5' : ''}`}
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold ${activeOrgId === org.id ? 'text-primary' : 'text-gray-500'}`}>
                                    {org.name.substring(0,2).toUpperCase()}
                                </div>
                                <div className="truncate">
                                    <p className={`font-medium truncate ${activeOrgId === org.id ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>{org.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-500">{org.plan}</p>
                                </div>
                            </div>
                            {activeOrgId === org.id && <span className="material-symbols-outlined text-primary text-lg">check_circle</span>}
                        </button>
                    ))}
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 p-2 bg-gray-50 dark:bg-gray-900/50">
                    <button 
                        onClick={() => { setIsOpen(false); setIsCreateOpen(true); }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all flex items-center justify-center gap-2 font-medium shadow-sm"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span> Create Organization
                    </button>
                </div>
            </div>
        </>
      )}

      {/* Portal based Modal ensures it is centered on screen and not trapped in sidebar */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Organization" size="lg">
         <form onSubmit={handleCreateOrg} className="p-6">
            <div className="flex flex-col gap-6">
                
                {/* Header / Branding */}
                <div className="flex flex-col items-center mb-2">
                    <div className={`w-20 h-20 rounded-2xl ${selectedColor} flex items-center justify-center shadow-xl mb-4 transition-colors duration-300`}>
                        <span className="text-3xl font-bold text-white">
                            {newOrgName ? newOrgName.substring(0,2).toUpperCase() : 'OR'}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This will be your organization's default workspace logo.</p>
                    
                    <div className="flex gap-2 mt-4 justify-center">
                        {ORG_COLORS.map((color) => (
                            <button
                                key={color.name}
                                type="button"
                                onClick={() => setSelectedColor(color.value)}
                                className={`w-8 h-8 rounded-full ${color.value} border-2 transition-all ${selectedColor === color.value ? 'border-white ring-2 ring-gray-400 dark:ring-gray-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                        <input 
                            type="text" 
                            value={newOrgName}
                            onChange={e => {
                                setNewOrgName(e.target.value);
                                if (!newOrgSlug || newOrgSlug === e.target.value.slice(0, -1).toLowerCase().replace(/\s+/g, '-')) {
                                    setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                }
                            }}
                            className="w-full px-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-primary"
                            placeholder="e.g. Acme Inc."
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Industry</label>
                        <select 
                            value={industry}
                            onChange={e => setIndustry(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-primary"
                        >
                            <option>Technology</option>
                            <option>Finance</option>
                            <option>Healthcare</option>
                            <option>Education</option>
                            <option>Retail</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Workspace URL</label>
                    <div className="flex shadow-sm rounded-lg overflow-hidden">
                        <span className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 text-gray-500 text-sm flex items-center font-mono">
                            app.expenseflow.com/
                        </span>
                        <input 
                            type="text" 
                            value={newOrgSlug}
                            onChange={e => setNewOrgSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            className="flex-1 px-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-primary font-mono text-sm"
                            placeholder="acme-inc"
                            required
                        />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">This is the unique URL your team will use to access the dashboard.</p>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <button 
                        type="button" 
                        onClick={() => setIsCreateOpen(false)} 
                        className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={isCreating}
                        className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary-600 rounded-lg disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-95"
                    >
                        {isCreating ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                                Creating...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-lg">rocket_launch</span>
                                Create Organization
                            </>
                        )}
                    </button>
                </div>
            </div>
         </form>
      </Modal>
    </div>
  );
};
