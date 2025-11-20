
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchExpenses, deleteExpense, updateExpense } from '../features/expenses/expensesSlice';
import { formatCurrency } from '../utils/formatters';
import { ExpenseCategory, Expense } from '../types';
import { Modal } from '../components/Modal';
import { AddExpense } from './AddExpense';

export const Expenses: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { items: expensesData, status } = useAppSelector((state) => state.expenses);
  const { currency } = useAppSelector((state) => state.ui);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterDate, setFilterDate] = useState(''); // Matches string dates for simplicity

  // Selection & Pagination
  const [selected, setSelected] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // UI States
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [status, dispatch]);

  // Filtering Logic
  const filteredExpenses = useMemo(() => {
    return expensesData.filter(expense => {
      const matchesSearch = 
        expense.merchant.toLowerCase().includes(searchQuery.toLowerCase()) || 
        expense.amount.toString().includes(searchQuery) ||
        (expense.description && expense.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = filterCategory === 'All Categories' || expense.category === filterCategory;
      
      const matchesDate = !filterDate || expense.date.toLowerCase().includes(filterDate.toLowerCase());

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [expensesData, searchQuery, filterCategory, filterDate]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExpenses, currentPage]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterDate]);

  // Handlers
  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelected(paginatedExpenses.map(ex => ex.id));
    } else {
      setSelected([]);
    }
  };

  const handleBulkApprove = async () => {
    if (window.confirm(`Approve ${selected.length} expenses?`)) {
      await Promise.all(selected.map(id => dispatch(updateExpense({ id, updates: { status: 'Approved' } }))));
      setSelected([]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selected.length} expenses? This action cannot be undone.`)) {
      await Promise.all(selected.map(id => dispatch(deleteExpense(id))));
      setSelected([]);
    }
  };

  const handleExport = (type: 'csv' | 'pdf') => {
    setIsExportOpen(false);
    if (type === 'csv') {
      const headers = ['ID', 'Date', 'Merchant', 'Category', 'Amount', 'Status', 'Notes'];
      const csvContent = [
        headers.join(','),
        ...filteredExpenses.map(row => 
          [row.id, `"${row.date}"`, `"${row.merchant}"`, `"${row.category}"`, row.amount, row.status, `"${row.description || ''}"`].join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `expenses_export_${new Date().toISOString().slice(0,10)}.csv`;
      link.click();
    } else {
      // Fallback for PDF since we don't have jspdf library
      window.print();
    }
  };

  if (status === 'loading' && expensesData.length === 0) {
    return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }

  return (
    <div className="p-6 lg:p-8 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 max-h-screen overflow-hidden">
      
      {/* Concise Filters Toolbar */}
      <div className="bg-white dark:bg-card-dark p-3 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm mb-4 shrink-0 z-20">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          
          {/* Search */}
          <div className="relative w-full lg:flex-1 lg:max-w-sm">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">search</span>
              <input 
                type="text" 
                placeholder="Search expenses..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary dark:text-white" 
              />
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Date Filter */}
            <div className="relative w-full sm:w-40">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">calendar_month</span>
               <input 
                 type="text" 
                 placeholder="e.g. Aug 2024" 
                 value={filterDate}
                 onChange={(e) => setFilterDate(e.target.value)}
                 className="w-full pl-9 pr-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary dark:text-white" 
               />
            </div>

            {/* Category Filter */}
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full sm:w-40 px-3 py-2 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary dark:text-white"
            >
               <option>All Categories</option>
               {Object.values(ExpenseCategory).map(cat => (
                 <option key={cat} value={cat}>{cat}</option>
               ))}
            </select>

             <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

             {/* Export & Apply */}
             <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative">
                    <button onClick={() => setIsExportOpen(!isExportOpen)} className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 whitespace-nowrap">
                        <span className="material-symbols-outlined text-lg">download</span>
                        <span className="hidden sm:inline">Export</span>
                    </button>
                    
                    {isExportOpen && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-card-dark rounded-lg shadow-xl border border-gray-200 dark:border-border-dark z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            <div className="p-1">
                                <button onClick={() => handleExport('csv')} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md gap-2 text-left">
                                    <span className="material-symbols-outlined text-lg text-green-600">table_view</span> CSV
                                </button>
                                <button onClick={() => handleExport('pdf')} className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md gap-2 text-left">
                                    <span className="material-symbols-outlined text-lg text-red-600">picture_as_pdf</span> Print / PDF
                                </button>
                            </div>
                        </div>
                    )}
                    {isExportOpen && <div className="fixed inset-0 z-20" onClick={() => setIsExportOpen(false)}></div>}
                </div>
                
                {/* Reset Filters Button */}
                {(searchQuery || filterCategory !== 'All Categories' || filterDate) && (
                  <button 
                    onClick={() => { setSearchQuery(''); setFilterCategory('All Categories'); setFilterDate(''); }}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg shadow-sm whitespace-nowrap"
                  >
                    Reset
                  </button>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm flex flex-col overflow-hidden min-h-0 relative z-0">
        {/* Bulk Actions */}
        {selected.length > 0 && (
          <div className="flex items-center justify-between px-6 py-2 bg-gray-50 dark:bg-background-dark/50 border-b border-gray-200 dark:border-border-dark shrink-0">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{selected.length} selected</span>
            <div className="flex gap-2">
              <button 
                onClick={handleBulkApprove}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">check</span> Approve
              </button>
              <button 
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">delete</span> Delete
              </button>
            </div>
          </div>
        )}

        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-sm text-left relative">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-dark/50 sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="p-4 w-10 bg-gray-50 dark:bg-[#161b22]">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={paginatedExpenses.length > 0 && selected.length === paginatedExpenses.length}
                      className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" 
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-[#161b22]">
                  <div className="flex items-center gap-1">Date</div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-[#161b22]">
                  <div className="flex items-center gap-1">Merchant</div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-[#161b22]">
                  <div className="flex items-center gap-1">Category</div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-[#161b22]">
                  <div className="flex items-center gap-1">Amount</div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 bg-gray-50 dark:bg-[#161b22]">
                   <div className="flex items-center gap-1">Status</div>
                </th>
                <th scope="col" className="px-6 py-3 font-medium text-right bg-gray-50 dark:bg-[#161b22]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
              {paginatedExpenses.length > 0 ? (
                paginatedExpenses.map((expense) => (
                  <tr 
                    key={expense.id} 
                    className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selected.includes(expense.id) ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                    onClick={() => navigate(`/expenses/${expense.id}`)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          checked={selected.includes(expense.id)}
                          onChange={() => toggleSelect(expense.id)}
                          className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600" 
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white font-medium">{expense.date}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{expense.merchant}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{expense.category}</td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(expense.amount, currency)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${expense.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
                          expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
                          'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
                        }`}>
                        {expense.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => navigate(`/expenses/${expense.id}`)}
                           className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                           title="View Details"
                         >
                           <span className="material-symbols-outlined text-lg">visibility</span>
                         </button>
                         <button 
                           onClick={() => setEditingExpense(expense)}
                           className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                           title="Edit Expense"
                         >
                           <span className="material-symbols-outlined text-lg">edit</span>
                         </button>
                         <button 
                           onClick={() => {
                             if(window.confirm('Are you sure you want to delete this expense?')) {
                               dispatch(deleteExpense(expense.id));
                             }
                           }}
                           className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                           title="Delete"
                         >
                           <span className="material-symbols-outlined text-lg">delete</span>
                         </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 dark:text-gray-400">
                    No expenses found. Try adjusting your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 dark:border-border-dark flex items-center justify-between shrink-0 bg-white dark:bg-card-dark">
           <span className="text-sm text-gray-500 dark:text-gray-400">
             Showing <span className="font-semibold text-gray-900 dark:text-white">{paginatedExpenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredExpenses.length)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredExpenses.length}</span>
           </span>
           <div className="flex gap-2">
             <button 
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="px-3 py-1 text-sm font-medium text-gray-500 bg-white dark:bg-card-dark border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Previous
             </button>
             <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages || totalPages === 0}
               className="px-3 py-1 text-sm font-medium text-gray-500 bg-white dark:bg-card-dark border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Next
             </button>
           </div>
        </div>
      </div>

      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense"
        size="lg"
      >
        <AddExpense 
          onClose={() => setEditingExpense(null)} 
          initialData={editingExpense}
        />
      </Modal>
    </div>
  );
};
