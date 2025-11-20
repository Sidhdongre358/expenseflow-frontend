
import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleTheme, setCurrency } from '../features/ui/uiSlice';
import { CurrencyCode } from '../types';

export const Settings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDark, currency } = useAppSelector((state) => state.ui);

  const currencies: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD'];

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your notification, security, and category settings.</p>
      </div>

      <div className="space-y-10">
        
        {/* Appearance Section */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance & Preferences</h2>
           </div>
           <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Dark Mode</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Switch between light and dark themes.</p>
                 </div>
                 <div className="md:col-span-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isDark} 
                        onChange={() => dispatch(toggleTheme())} 
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center pt-6 border-t border-gray-100 dark:border-gray-800">
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Global Currency</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Select your preferred currency for all amounts.</p>
                 </div>
                 <div className="md:col-span-2">
                    <div className="relative max-w-xs">
                       <select 
                         value={currency}
                         onChange={(e) => dispatch(setCurrency(e.target.value as CurrencyCode))}
                         className="w-full pl-4 pr-10 py-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary appearance-none"
                       >
                         {currencies.map((c) => (
                           <option key={c} value={c}>{c}</option>
                         ))}
                       </select>
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                         <span className="material-symbols-outlined">expand_more</span>
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
           </div>
           <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Expense Threshold</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get notified for expenses over this amount.</p>
                 </div>
                 <div className="md:col-span-2">
                    <div className="relative max-w-xs">
                       <input type="text" defaultValue="1000.00" className="w-full px-4 py-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border-t border-gray-100 dark:border-gray-800 pt-6">
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Email Alerts</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Receive summaries and alerts in your inbox.</p>
                 </div>
                 <div className="md:col-span-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/20 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                    </label>
                 </div>
              </div>
           </div>
        </section>

        {/* Security Section */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Security</h2>
           </div>
           <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                 <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Change your account password.</p>
                 </div>
                 <div className="md:col-span-2">
                    <button className="px-4 py-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                       Change Password
                    </button>
                 </div>
              </div>
           </div>
        </section>

        {/* Manage Categories */}
        <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden">
           <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark">
             <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Categories</h2>
           </div>
           <div className="p-6">
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                 {['Software', 'Travel', 'Office Supplies', 'Marketing'].map((cat) => (
                    <li key={cat} className="flex items-center justify-between py-3 first:pt-0">
                       <span className="text-sm font-medium text-gray-900 dark:text-white">{cat}</span>
                       <button className="text-sm font-medium text-danger hover:text-red-700">Remove</button>
                    </li>
                 ))}
              </ul>
              <div className="mt-6 flex gap-3">
                 <input type="text" placeholder="New category name" className="flex-1 px-4 py-2 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
                 <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 shadow-sm">Add Category</button>
              </div>
           </div>
        </section>

        <div className="flex justify-end">
           <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium shadow-lg shadow-primary/25 hover:bg-primary-600 transition-all transform active:scale-[0.98]">Save Changes</button>
        </div>

      </div>
    </div>
  );
};
