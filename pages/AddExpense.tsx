
import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addExpense, updateExpense } from '../features/expenses/expensesSlice';
import { getCurrencySymbol } from '../utils/formatters';
import { ExpenseCategory, Expense } from '../types';

interface AddExpenseProps {
  onClose: () => void;
  initialData?: Expense | null;
}

export const AddExpense: React.FC<AddExpenseProps> = ({ onClose, initialData }) => {
  const dispatch = useAppDispatch();
  const { currency } = useAppSelector((state) => state.ui);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<string>('Software');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('Corporate Card');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with data if editing
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.merchant);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category);
      
      // Attempt to parse date string back to YYYY-MM-DD for input
      const parsedDate = new Date(initialData.date);
      if (!isNaN(parsedDate.getTime())) {
          setDate(parsedDate.toISOString().split('T')[0]);
      }

      setNotes(initialData.description || '');
      // Note: We can't easily set a File object from a URL for the input, 
      // so we'll skip setting 'receipt' state for display unless user uploads a new one.
    }
  }, [initialData]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setReceipt(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !amount || !category || !date) return;

    setIsSubmitting(true);

    // In a real app, we would upload the receipt file here and get a URL back
    const mockReceiptUrl = receipt ? URL.createObjectURL(receipt) : initialData?.receiptUrl;

    const expenseData = {
      merchant: title,
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category,
      amount: parseFloat(amount),
      status: initialData?.status || 'Pending',
      description: notes,
      receiptUrl: mockReceiptUrl,
      user: 'Current User'
    };

    try {
      if (initialData) {
        await dispatch(updateExpense({ id: initialData.id, updates: expenseData })).unwrap();
      } else {
        await dispatch(addExpense(expenseData)).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        
        {/* Title Field */}
        <div className="space-y-1.5">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Merchant / Title</label>
           <div className="relative">
             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">store</span>
             <input 
               type="text" 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Where did you spend?" 
               className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1c2431] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white placeholder-gray-400 transition-all shadow-sm"
             />
           </div>
        </div>

        {/* Amount & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <div className="relative group">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold group-focus-within:text-primary transition-colors">{getCurrencySymbol(currency)}</span>
                 <input 
                   type="number" 
                   value={amount}
                   onChange={(e) => setAmount(e.target.value)}
                   placeholder="0.00" 
                   className="w-full pl-8 pr-4 py-3 bg-white dark:bg-[#1c2431] border border-gray-200 dark:border-gray-700 rounded-xl text-lg font-semibold focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white placeholder-gray-300 transition-all shadow-sm"
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">category</span>
                 <select 
                   value={category}
                   onChange={(e) => setCategory(e.target.value)}
                   className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1c2431] border border-gray-200 dark:border-gray-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all shadow-sm"
                 >
                    {Object.values(ExpenseCategory).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                 </select>
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 material-symbols-outlined text-[20px]">expand_more</span>
              </div>
           </div>
        </div>

        {/* Date & Payment Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">calendar_month</span>
                 <input 
                    type="date" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1c2431] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all shadow-sm"
                 />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              <div className="relative">
                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">credit_card</span>
                 <select 
                   value={paymentMethod}
                   onChange={(e) => setPaymentMethod(e.target.value)}
                   className="w-full pl-10 pr-10 py-3 bg-white dark:bg-[#1c2431] border border-gray-200 dark:border-gray-700 rounded-xl text-sm appearance-none focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white transition-all shadow-sm"
                 >
                    <option>Corporate Card</option>
                    <option>Personal Card</option>
                    <option>Cash</option>
                 </select>
                 <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 material-symbols-outlined text-[20px]">expand_more</span>
              </div>
           </div>
        </div>
        
        {/* Notes */}
        <div className="space-y-1.5">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
           <div className="relative">
              <textarea 
                rows={3} 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add details..." 
                className="w-full p-4 bg-white dark:bg-[#1c2431] border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary dark:text-white resize-none transition-all shadow-sm"
              ></textarea>
           </div>
        </div>

        {/* Receipt Upload */}
        <div className="space-y-1.5">
           <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Receipt</label>
           <div
              className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all duration-200 group cursor-pointer ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-[1.01]' 
                  : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#1c2431] hover:border-primary/50 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
           >
              <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none">
                 <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-700 mb-3 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl text-gray-500 dark:text-gray-400 group-hover:text-primary">cloud_upload</span>
                 </div>
                 <p className="mb-1 text-sm text-gray-600 dark:text-gray-300 font-medium">
                    {receipt ? (
                      <span className="text-primary truncate max-w-[200px] block">{receipt.name}</span>
                    ) : (
                      initialData?.receiptUrl ? (
                        <span className="text-gray-500">Replace current receipt</span>
                      ) : (
                        <><span className="text-primary">Click to upload</span> or drag and drop</>
                      )
                    )}
                 </p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or PDF (max. 10MB)</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
           </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-[#161b22]/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 rounded-b-xl">
         <button 
           onClick={onClose}
           className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 transition-all"
         >
           Cancel
         </button>
         <button 
           onClick={handleSubmit}
           disabled={isSubmitting || !title || !amount}
           className="w-full sm:w-auto px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary-600 focus:ring-4 focus:ring-primary/30 shadow-lg shadow-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
         >
           {isSubmitting && <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>}
           {initialData ? 'Update Expense' : 'Save Expense'}
         </button>
      </div>
    </div>
  );
};
