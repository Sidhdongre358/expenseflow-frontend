
import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from '../components/Modal';
import { CreateBudget } from './CreateBudget';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBudgets, addBudget, updateBudget, deleteBudget } from '../features/budgets/budgetsSlice';
import { fetchExpenses } from '../features/expenses/expensesSlice';
import { Budget } from '../types';
import { formatCurrency } from '../utils/formatters';

export const Budgets: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: budgets, status: budgetStatus } = useAppSelector((state) => state.budgets);
  const { items: expenses, status: expenseStatus } = useAppSelector((state) => state.expenses);
  const { currency } = useAppSelector((state) => state.ui);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = useState<Budget | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (budgetStatus === 'idle') {
      dispatch(fetchBudgets());
    }
    if (expenseStatus === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [budgetStatus, expenseStatus, dispatch]);

  // Dynamically calculate spent amount based on actual expenses
  const processedBudgets = useMemo(() => {
    return budgets.map(budget => {
      // Filter expenses by category. In a real app, you might also filter by the current month/period.
      const budgetExpenses = expenses.filter(e => e.category === budget.category);
      const calculatedSpent = budgetExpenses.reduce((sum, e) => sum + e.amount, 0);
      
      return {
        ...budget,
        spent: calculatedSpent 
      };
    });
  }, [budgets, expenses]);

  const totalBudget = processedBudgets.reduce((acc, curr) => acc + curr.total, 0);
  const totalSpent = processedBudgets.reduce((acc, curr) => acc + curr.spent, 0);
  
  const handleSaveBudget = async (budgetData: any) => {
    setIsSubmitting(true);
    try {
      if (editingBudget) {
        await dispatch(updateBudget({ id: editingBudget.id, updates: budgetData })).unwrap();
      } else {
        await dispatch(addBudget(budgetData)).unwrap();
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save budget:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (budget: Budget) => {
    setDeletingBudget(budget);
  };

  const confirmDelete = async () => {
    if (deletingBudget) {
      setIsSubmitting(true);
      try {
        await dispatch(deleteBudget(deletingBudget.id)).unwrap();
        setDeletingBudget(null);
      } catch (error) {
         console.error("Failed to delete budget:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBudget(null);
  };

  const getProgressColor = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage >= 100) return 'bg-red-600';
    if (percentage >= 85) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-primary';
  };

  if (budgetStatus === 'loading' && budgets.length === 0) {
     return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }

  return (
    <div className="p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Budgets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monitor and manage your monthly spending limits.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Create Budget
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <span className="material-symbols-outlined text-blue-500">account_balance</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Budget</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBudget, currency)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500/10 rounded-full">
              <span className="material-symbols-outlined text-orange-500">payments</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpent, currency)}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full">
              <span className="material-symbols-outlined text-green-500">savings</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Remaining</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(Math.max(0, totalBudget - totalSpent), currency)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {processedBudgets.map((budget) => {
            const percentage = Math.min((budget.spent / budget.total) * 100, 100);
            const isOverBudget = budget.spent > budget.total;

            return (
              <div key={budget.id} className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col group">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${budget.bg} ${budget.color} bg-opacity-10`}>
                      <span className="material-symbols-outlined">{budget.icon || 'category'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{budget.category}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{budget.period || 'Monthly'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(budget)}
                      className="text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
                      title="Edit Budget"
                    >
                      <span className="material-symbols-outlined text-[20px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(budget)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"
                      title="Delete Budget"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                       <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Spent</span>
                       <span className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(budget.spent, currency)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Limit</span>
                       <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{formatCurrency(budget.total, currency)}</span>
                    </div>
                  </div>
                  
                  <div className="h-3 w-full bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${getProgressColor(budget.spent, budget.total)}`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                     <span className={`font-bold px-2 py-1 rounded-md ${
                        isOverBudget ? 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400' : 
                        'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                     }`}>
                        {percentage.toFixed(1)}%
                     </span>
                     <span className={`${isOverBudget ? 'text-red-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                        {isOverBudget 
                          ? `${formatCurrency(budget.spent - budget.total, currency)} over` 
                          : `${formatCurrency(budget.total - budget.spent, currency)} left`
                        }
                     </span>
                  </div>
                </div>
              </div>
            );
        })}
        
        {/* Empty State */}
        {processedBudgets.length === 0 && budgetStatus !== 'loading' && (
             <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white dark:bg-card-dark rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                 <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">savings</span>
                 </div>
                 <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No budgets yet</h3>
                 <p className="text-gray-500 dark:text-gray-400 mb-6 text-center max-w-sm">Create your first budget to start tracking expenses against your limits.</p>
                 <button 
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                 >
                    Create Budget
                 </button>
             </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBudget ? "Edit Budget" : "Create New Budget"}
        size="md"
      >
        <CreateBudget 
          onClose={handleCloseModal} 
          onSave={handleSaveBudget} 
          initialData={editingBudget}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingBudget}
        onClose={() => setDeletingBudget(null)}
        title="Delete Budget"
        size="sm"
      >
        <div className="p-6">
            <div className="flex items-center gap-4 mb-4 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-100 dark:border-red-900/20">
               <span className="material-symbols-outlined text-2xl">warning</span>
               <div>
                  <h4 className="font-semibold text-sm uppercase tracking-wide">Warning</h4>
                  <p className="text-xs opacity-90">This action is permanent</p>
               </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Are you sure you want to delete the <span className="font-bold text-gray-900 dark:text-white">{deletingBudget?.category}</span> budget?
            </p>
            <div className="flex justify-end gap-3">
                <button
                    onClick={() => setDeletingBudget(null)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    onClick={confirmDelete}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                    {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
                    Delete Budget
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
