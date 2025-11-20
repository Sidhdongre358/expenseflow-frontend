
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateOrgSettings } from '../features/org/orgSlice';

export const OrgSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeOrg } = useAppSelector(state => state.orgs);
  
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
      if(activeOrg) {
          setName(activeOrg.name);
          setSlug(activeOrg.slug);
      }
  }, [activeOrg]);

  const handleSave = async () => {
      if (!activeOrg) return;
      setIsSaving(true);
      await dispatch(updateOrgSettings({ name, slug }));
      setIsSaving(false);
  };

  const handlePlanChange = async (plan: 'Free' | 'Pro' | 'Enterprise') => {
      if (window.confirm(`Switch to ${plan} plan?`)) {
          await dispatch(updateOrgSettings({ plan }));
      }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-1">Manage general configuration and billing for {activeOrg?.name}.</p>
      </div>

      <div className="space-y-8">
        {/* General Info */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Organization Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Slug URL</label>
                    <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-gray-100 dark:bg-gray-800 border border-r-0 border-gray-300 dark:border-gray-700 rounded-l-lg text-gray-500 text-sm">app.expenseflow.com/</span>
                        <input 
                            type="text" 
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-r-lg dark:text-white focus:ring-2 focus:ring-primary"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    Save Changes
                </button>
            </div>
        </section>

        {/* Billing */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Plan & Billing</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan: <span className="font-bold text-primary">{activeOrg?.plan}</span></p>
                </div>
                <button className="text-sm text-primary font-medium hover:underline">View Invoices</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div 
                    onClick={() => handlePlanChange('Free')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${activeOrg?.plan === 'Free' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'}`}
                >
                    <h3 className="font-bold dark:text-white">Free</h3>
                    <p className="text-sm text-gray-500">$0/mo</p>
                </div>
                <div 
                    onClick={() => handlePlanChange('Pro')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${activeOrg?.plan === 'Pro' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'}`}
                >
                    <h3 className="font-bold dark:text-white">Pro</h3>
                    <p className="text-sm text-gray-500">$29/mo</p>
                </div>
                <div 
                    onClick={() => handlePlanChange('Enterprise')}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${activeOrg?.plan === 'Enterprise' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100'}`}
                >
                    <h3 className="font-bold dark:text-white">Enterprise</h3>
                    <p className="text-sm text-gray-500">Custom</p>
                </div>
            </div>
            
            <div className="flex justify-end">
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">Manage Subscription</button>
            </div>
        </section>
        
        {/* Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20 overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Once you delete an organization, there is no going back. Please be certain.</p>
            <button 
                onClick={() => window.confirm("Are you sure? This cannot be undone.")}
                className="px-4 py-2 bg-white dark:bg-transparent border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
                Delete Organization
            </button>
        </section>
      </div>
    </div>
  );
};
