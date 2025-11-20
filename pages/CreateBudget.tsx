
import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { getCurrencySymbol } from '../utils/formatters';
import { ExpenseCategory } from '../types';

interface BudgetData {
  category: string;
  total: number;
  period: string;
  icon?: string;
  color?: string;
  bg?: string;
  spent?: number;
  id?: number;
}

interface CreateBudgetProps {
  onClose: () => void;
  onSave: (budget: any) => void;
  initialData?: BudgetData | null;
  isLoading?: boolean;
}

const THEMES = [
  { name: 'Blue', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' },
  { name: 'Purple', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20' },
  { name: 'Green', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-500/20' },
  { name: 'Orange', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20' },
  { name: 'Red', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20' },
  { name: 'Teal', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-500/20' },
];

const ICONS = ['category', 'flight', 'restaurant', 'inventory_2', 'campaign', 'groups', 'school', 'dns', 'payments', 'savings'];

export const CreateBudget: React.FC<CreateBudgetProps> = ({ onClose, onSave, initialData, isLoading }) => {
  const { currency } = useAppSelector((state) => state.ui);
  
  const [category, setCategory] = useState(initialData?.category || 'Software');
  const [total, setTotal] = useState(initialData?.total?.toString() || '');
  const [period, setPeriod] = useState(initialData?.period || 'Monthly');
  
  // Visual customization
  const [selectedIcon, setSelectedIcon] = useState(initialData?.icon || 'category');
  const [selectedTheme, setSelectedTheme] = useState(0);

  // Try to match initial theme if editing
  useEffect(() => {
      if (initialData?.color && initialData?.bg) {
          const index = THEMES.findIndex(t => t.color === initialData.color && t.bg === initialData.bg);
          if (index !== -1) setSelectedTheme(index);
      }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!total || isNaN(Number(total)) || Number(total) <= 0) return;

    const theme = THEMES[selectedTheme];

    onSave({
      ...initialData,
      category,
      total: Number(total),
      spent: initialData?.spent || 0,
      period,
      icon: selectedIcon,
      color: theme.color,
      bg: theme.bg,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full max-h-[80vh]">
       <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          
          {/* Category & Icon Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category Name</label>
                <div className="relative">
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-shadow"
                >
                    {Object.values(ExpenseCategory).map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <span className="material-symbols-outlined">expand_more</span>
                </span>
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                 <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Icon</label>
                 <div className="relative">
                    <button 
                        type="button"
                        className="w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:text-white"
                    >
                        <span className="material-symbols-outlined">{selectedIcon}</span>
                        <span className="material-symbols-outlined text-gray-400 text-lg">expand_more</span>
                    </button>
                    {/* Simple Icon Picker Dropdown (For demo simplified as a grid below) */}
                 </div>
            </div>
          </div>

          {/* Icon Picker Grid (Visual) */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium uppercase tracking-wider">Select Icon</p>
              <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-2 rounded-lg transition-all ${selectedIcon === icon ? 'bg-primary text-white shadow-md scale-110' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                      >
                          <span className="material-symbols-outlined text-[20px]">{icon}</span>
                      </button>
                  ))}
              </div>
          </div>

          {/* Amount & Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Limit</label>
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold group-focus-within:text-primary transition-colors">{getCurrencySymbol(currency)}</span>
                    <input
                    type="number"
                    value={total}
                    onChange={(e) => setTotal(e.target.value)}
                    placeholder="0.00"
                    required
                    min="1"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary dark:text-white font-semibold transition-shadow"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reset Period</label>
                <div className="relative">
                    <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-primary focus:border-primary dark:text-white transition-shadow"
                    >
                    <option>Monthly</option>
                    <option>Quarterly</option>
                    <option>Yearly</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <span className="material-symbols-outlined">expand_more</span>
                    </span>
                </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Budget Color Theme</label>
              <div className="grid grid-cols-6 gap-3">
                  {THEMES.map((theme, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedTheme(index)}
                        className={`h-10 w-full rounded-lg border-2 transition-all ${theme.bg} ${theme.color} ${selectedTheme === index ? 'border-gray-900 dark:border-white scale-105' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'}`}
                      >
                          {selectedTheme === index && <span className="material-symbols-outlined text-sm">check</span>}
                      </button>
                  ))}
              </div>
          </div>
       </div>

       {/* Footer */}
       <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#161b22]/50 flex justify-end gap-3 rounded-b-xl">
            <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
                Cancel
            </button>
            <button
                type="submit"
                disabled={isLoading || !total || Number(total) <= 0}
                className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
                {isLoading && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                {initialData ? 'Update Budget' : 'Create Budget'}
            </button>
       </div>
    </form>
  );
};
