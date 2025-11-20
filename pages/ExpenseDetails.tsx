
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateExpense } from '../features/expenses/expensesSlice';
import { formatCurrency } from '../utils/formatters';
import { ExpenseCategory, ExpenseStatus } from '../types';

export const ExpenseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { items: expenses, status } = useAppSelector((state) => state.expenses);
  const { currency } = useAppSelector((state) => state.ui);

  const expense = expenses.find((e) => e.id === id);
  
  // Local form state
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Sync state when expense loads
  useEffect(() => {
    if (expense) {
      setCategory(expense.category);
      setDescription(expense.description || '');
    }
  }, [expense]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (status === 'loading') {
    return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }

  if (!expense) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <span className="material-symbols-outlined text-4xl text-gray-400">search_off</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Expense Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The expense you are looking for does not exist or has been removed.</p>
        <button 
            onClick={() => navigate('/expenses')}
            className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
        >
            Back to Expenses
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: ExpenseStatus) => {
      setIsSaving(true);
      try {
          await dispatch(updateExpense({ id: expense.id, updates: { status: newStatus } })).unwrap();
          setSuccessMessage(`Expense marked as ${newStatus}`);
      } catch (error) {
          console.error('Failed to update status:', error);
      } finally {
          setIsSaving(false);
      }
  };

  const handleSaveDetails = async () => {
      if (category === expense.category && description === (expense.description || '')) return;
      
      setIsSaving(true);
      try {
          await dispatch(updateExpense({ id: expense.id, updates: { category, description } })).unwrap();
          setSuccessMessage('Details updated successfully');
      } catch (error) {
          console.error('Failed to update details:', error);
      } finally {
          setIsSaving(false);
      }
  };

  const statusColor = 
    expense.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 
    expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' :
    'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';

  // Synthetic timeline data based on expense date
  const createdDate = new Date(expense.date);
  const uploadDate = new Date(createdDate.getTime() + 1000 * 60 * 5); // +5 mins

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Toast Notification */}
      {successMessage && (
        <div className="absolute top-6 right-6 z-50 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
           <span className="material-symbols-outlined text-green-400 dark:text-green-600">check_circle</span>
           <span className="font-medium text-sm">{successMessage}</span>
        </div>
      )}

      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
               <span className="material-symbols-outlined">arrow_back</span>
             </button>
             <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expense Details</h1>
             <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColor}`}>
                {expense.status}
             </span>
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
               <span className="material-symbols-outlined">print</span>
             </button>
             <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
               <span className="material-symbols-outlined">share</span>
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Receipt Preview */}
          <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-background-dark border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-border-dark p-8 flex items-center justify-center min-h-[400px]">
             <div className="relative group cursor-zoom-in w-full flex justify-center">
               {expense.receiptUrl ? (
                   <>
                   <img 
                      src={expense.receiptUrl} 
                      alt="Receipt" 
                      className="rounded-lg shadow-sm max-w-full h-auto max-h-[500px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                       <span className="material-symbols-outlined text-white text-4xl drop-shadow-lg">zoom_in</span>
                    </div>
                   </>
               ) : (
                   <div className="text-center p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-2">receipt_long</span>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">No receipt attached</p>
                   </div>
               )}
             </div>
          </div>

          {/* Details & Audit */}
          <div className="w-full lg:w-2/3 p-8">
            <div className="grid gap-8">
              {/* Basic Info */}
              <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Expense Information</h2>
                    <span className="text-xs font-mono text-gray-400">ID: {expense.id}</span>
                </div>
                <div className="grid gap-4">
                   <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Merchant</span>
                      <span className="font-medium text-gray-900 dark:text-white text-lg">{expense.merchant}</span>
                   </div>
                   <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-gray-600 dark:text-gray-400">Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">{expense.date}</span>
                   </div>
                   <div className="flex justify-between py-3 border-b border-gray-100 dark:border-gray-800 items-center">
                      <span className="text-gray-600 dark:text-gray-400">Amount</span>
                      <div className="text-right">
                         <span className="text-2xl font-bold text-gray-900 dark:text-white block">{formatCurrency(expense.amount, currency)}</span>
                      </div>
                   </div>
                   <div className="flex justify-between py-3">
                      <span className="text-gray-600 dark:text-gray-400">Submitted By</span>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold">
                            {expense.userName ? expense.userName.charAt(0) : 'U'}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{expense.userName || 'User'}</span>
                      </div>
                   </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary"
                    >
                       {Object.values(ExpenseCategory).map(cat => (
                           <option key={cat} value={cat}>{cat}</option>
                       ))}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                    <input 
                        type="text" 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add details about this expense..."
                        className="w-full px-3 py-2.5 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary" 
                    />
                 </div>
              </div>

              {/* Smart Suggestions */}
              {['Cloud Services', 'Infrastructure', 'Hosting'].some(tag => !category.includes(tag)) && (
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                        <span className="text-sm font-medium text-primary">Suggested Categories</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['Software', 'Office Supplies', 'Travel'].filter(c => c !== category).slice(0, 3).map(tag => (
                        <button 
                            key={tag} 
                            onClick={() => setCategory(tag)}
                            className="px-3 py-1 bg-white dark:bg-surface-dark border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm rounded-full hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-colors"
                        >
                            {tag}
                        </button>
                        ))}
                    </div>
                  </div>
              )}
              
              {/* Save Button for Edits */}
              {(category !== expense.category || description !== (expense.description || '')) && (
                  <div className="flex justify-end">
                      <button 
                        onClick={handleSaveDetails}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors shadow-sm flex items-center gap-2"
                      >
                         {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                         Save Changes
                      </button>
                  </div>
              )}

              {/* Audit Timeline (Simulated) */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Audit Timeline</h2>
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-8">
                   <div className="relative">
                      <div className="absolute -left-[21px] top-0 w-5 h-5 rounded-full bg-primary border-4 border-white dark:border-card-dark flex items-center justify-center">
                        <span className="material-symbols-outlined text-[10px] text-white">add</span>
                      </div>
                      <div>
                         <p className="text-sm font-medium text-gray-900 dark:text-white">Expense created by {expense.userName || 'User'}</p>
                         <p className="text-xs text-gray-500">{createdDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short'})}</p>
                      </div>
                   </div>
                   
                   {expense.receiptUrl && (
                    <div className="relative">
                        <div className="absolute -left-[21px] top-0 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-card-dark flex items-center justify-center">
                            <span className="material-symbols-outlined text-[10px] text-gray-600 dark:text-gray-400">upload_file</span>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">Receipt uploaded</p>
                            <p className="text-xs text-gray-500">{uploadDate.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short'})}</p>
                        </div>
                    </div>
                   )}

                   {expense.status !== 'Pending' && (
                    <div className="relative">
                        <div className={`absolute -left-[21px] top-0 w-5 h-5 rounded-full border-4 border-white dark:border-card-dark flex items-center justify-center ${expense.status === 'Approved' ? 'bg-green-500' : 'bg-red-500'}`}>
                            <span className="material-symbols-outlined text-[10px] text-white">{expense.status === 'Approved' ? 'check' : 'close'}</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Status changed to {expense.status}</p>
                            <p className="text-xs text-gray-500">Just now</p>
                        </div>
                    </div>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="bg-gray-50 dark:bg-surface-dark px-6 py-4 border-t border-gray-200 dark:border-border-dark flex justify-end gap-3">
           {expense.status !== 'Rejected' && (
                <button 
                    onClick={() => handleStatusChange(ExpenseStatus.Rejected)}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-danger hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    Reject
                </button>
           )}
           {expense.status !== 'Approved' && (
                <button 
                    onClick={() => handleStatusChange(ExpenseStatus.Approved)}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-success hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                     {isSaving && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    Approve
                </button>
           )}
        </div>
      </div>
    </div>
  );
};
