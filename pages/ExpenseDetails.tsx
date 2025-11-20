
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { formatCurrency } from '../utils/formatters';

export const ExpenseDetails: React.FC = () => {
  const navigate = useNavigate();
  const { currency } = useAppSelector((state) => state.ui);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
               <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expense Details</h1>
             <span className="px-3 py-1 text-xs font-medium rounded-full bg-warning/10 text-warning border border-warning/20">Pending</span>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
               <span className="material-symbols-outlined">more_horiz</span>
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Receipt Preview */}
          <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-background-dark border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-border-dark p-8 flex items-center justify-center min-h-[400px]">
             <div className="relative group cursor-zoom-in">
               <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBbKyDL0VFZc8LXy66xEK7TC0q5eSn-RRm6KWJFC9Iogg_697fvpWtuildKteDdx-Yln_yzBXMqncYoahBrngs9iBsLgePiEzaXezycistNlD7I9xZ6pRrY-O1BLGLKn7rZn25003oA2RdeaJYE1Dc-oUDuxX3m678QH8X30M0fxwimIpNlBCtDFICiffcTBozHMRQgYjPiZc5Y8WGhqOKh1H9v0-sNHgtZSqLZnElQWr9mek0Ynp0MDaOXtfb2NM7QMttt-xDdUDg" 
                  alt="Receipt" 
                  className="rounded-lg shadow-lg max-w-full h-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                   <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">zoom_in</span>
                </div>
             </div>
          </div>

          {/* Details & Audit */}
          <div className="w-full lg:w-2/3 p-8">
            <div className="grid gap-8">
              {/* Basic Info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Expense Information</h2>
                <div className="grid gap-4">
                   <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Merchant</span>
                      <span className="font-medium text-gray-900 dark:text-white">DigitalOcean</span>
                   </div>
                   <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">Oct 26, 2023</span>
                   </div>
                   <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Amount</span>
                      <div className="text-right">
                         <span className="text-2xl font-bold text-gray-900 dark:text-white block">{formatCurrency(120.00, currency)}</span>
                         <span className="text-xs text-gray-400 uppercase">{currency}</span>
                      </div>
                   </div>
                   <div className="flex justify-between py-3">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                      <span className="font-medium text-gray-900 dark:text-white">Visa •••• 4242</span>
                   </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select className="w-full px-3 py-2.5 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary">
                       <option>Software</option>
                       <option>Hosting</option>
                       <option>Infrastructure</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <input type="text" defaultValue="Monthly server costs" className="w-full px-3 py-2.5 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" />
                 </div>
              </div>

              {/* AI Suggestions */}
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                    <span className="text-sm font-medium text-primary">Suggested Categories</span>
                 </div>
                 <div className="flex gap-2 flex-wrap">
                    {['Cloud Services', 'Infrastructure', 'Hosting'].map(tag => (
                       <button key={tag} className="px-3 py-1 bg-white dark:bg-surface-dark border border-primary/20 text-primary text-sm rounded-full hover:bg-primary hover:text-white transition-colors">
                          {tag}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Audit Timeline */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Audit Timeline</h2>
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                   <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-white dark:border-card-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-white">add</span>
                      </div>
                      <div>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">Expense created by Alex Johnson</p>
                         <p className="text-xs text-gray-500">Oct 26, 2023, 09:15 AM</p>
                      </div>
                   </div>
                   <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-card-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-gray-600 dark:text-gray-400">edit</span>
                      </div>
                      <div>
                         <p className="text-sm text-gray-600 dark:text-gray-300">Category changed to "Software"</p>
                         <p className="text-xs text-gray-500">Oct 26, 2023, 09:16 AM</p>
                      </div>
                   </div>
                   <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-card-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-gray-600 dark:text-gray-400">upload_file</span>
                      </div>
                      <div>
                         <p className="text-sm text-gray-600 dark:text-gray-300">Receipt uploaded</p>
                         <p className="text-xs text-gray-500">Oct 26, 2023, 09:18 AM</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-surface-dark px-6 py-4 border-t border-gray-200 dark:border-border-dark flex justify-end gap-3">
           <button className="px-4 py-2 text-sm font-medium text-white bg-danger hover:bg-danger/90 rounded-lg shadow-sm transition-colors">Reject</button>
           <button className="px-4 py-2 text-sm font-medium text-white bg-success hover:bg-success/90 rounded-lg shadow-sm transition-colors">Approve</button>
        </div>
      </div>
    </div>
  );
};
