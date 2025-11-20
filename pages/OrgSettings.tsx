
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateOrgSettings, addOrgCategory, removeOrgCategory } from '../features/org/orgSlice';
import { useNavigate } from 'react-router-dom';

export const OrgSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeOrg } = useAppSelector(state => state.orgs);
  
  // General Info State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories State
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  useEffect(() => {
      if(activeOrg) {
          setName(activeOrg.name);
          setSlug(activeOrg.slug);
          setBillingEmail(activeOrg.billingEmail || '');
          setLogo(activeOrg.logo || '');
      }
  }, [activeOrg]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setLogo(imageUrl);
    }
  };

  const handleSave = async () => {
      if (!activeOrg) return;
      setIsSaving(true);
      await dispatch(updateOrgSettings({ name, slug, billingEmail, logo }));
      setIsSaving(false);
  };

  const handleAddCategory = async () => {
      if (!newCategory.trim()) return;
      setIsAddingCategory(true);
      await dispatch(addOrgCategory(newCategory.trim()));
      setNewCategory('');
      setIsAddingCategory(false);
  };

  const handleRemoveCategory = async (category: string) => {
      if (window.confirm(`Remove "${category}"?`)) {
        await dispatch(removeOrgCategory(category));
      }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-1">Manage general configuration for {activeOrg?.name}.</p>
      </div>

      <div className="space-y-8">
        {/* General Information */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">General Information</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Upload */}
                <div className="flex flex-col items-center gap-3">
                    <div 
                        className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer hover:border-primary dark:hover:border-primary transition-colors overflow-hidden relative group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {logo ? (
                            <img src={logo} alt="Org Logo" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">{name.substring(0,2).toUpperCase()}</span>
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-white">upload</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Organization Logo</p>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*"
                    />
                </div>

                {/* Inputs */}
                <div className="flex-1 grid grid-cols-1 gap-6">
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
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Billing Email</label>
                            <input 
                                type="email" 
                                value={billingEmail}
                                onChange={e => setBillingEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg dark:text-white focus:ring-2 focus:ring-primary"
                                placeholder="billing@company.com"
                            />
                        </div>
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
            </div>

            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
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

        {/* Manage Categories */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Categories</h2>
           </div>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Customize the categories available for expenses in your organization.</p>
           
           <div className="flex flex-wrap gap-2 mb-6">
              {activeOrg?.categories?.map((cat) => (
                 <div key={cat} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium">{cat}</span>
                    <button 
                        onClick={() => handleRemoveCategory(cat)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                 </div>
              ))}
           </div>

           <div className="flex gap-3">
                 <input 
                    type="text" 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name" 
                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" 
                    onKeyDown={(e) => { if(e.key === 'Enter') handleAddCategory(); }}
                 />
                 <button 
                    onClick={handleAddCategory}
                    disabled={!newCategory.trim() || isAddingCategory}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm disabled:opacity-50 flex items-center gap-2"
                 >
                    {isAddingCategory ? <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span> : <span className="material-symbols-outlined text-lg">add</span>}
                    Add
                 </button>
           </div>
        </section>

        {/* Billing Teaser */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
             <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Subscription & Billing</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage your plan, payment methods, and invoices.</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Current Plan: {activeOrg?.plan}
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/billing')}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-lg">credit_card</span>
                    Manage Billing
                </button>
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
