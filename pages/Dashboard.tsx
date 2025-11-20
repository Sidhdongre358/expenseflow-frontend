
import React, { useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { formatCurrency } from '../utils/formatters';
import { fetchExpenses } from '../features/expenses/expensesSlice';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#3b82f6', '#14b8a6', '#f59e0b', '#ef4444', '#64748b', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<{ onOpenNewExpense: () => void }> = ({ onOpenNewExpense }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currency } = useAppSelector((state) => state.ui);
  const { items: expenses, status } = useAppSelector((state) => state.expenses);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchExpenses());
    }
  }, [status, dispatch]);

  // --- Calculated Metrics ---

  // 1. Total Monthly Spend (Simple sum of all visible expenses for demo, normally filtered by current month)
  const totalSpend = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  // 2. Recent Transactions (Sorted by date)
  const recentTransactions = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);

  // 3. Chart Data: Group by Category
  const pieData = useMemo(() => {
    const grouped: Record<string, number> = {};
    expenses.forEach(expense => {
      const cat = expense.category;
      grouped[cat] = (grouped[cat] || 0) + expense.amount;
    });
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [expenses]);

  // 4. Trend Data: Group by Month
  const areaData = useMemo(() => {
    const grouped: Record<string, number> = {};
    // Sort expenses by date first to ensure chart order
    const sorted = [...expenses].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    sorted.forEach(expense => {
      const date = new Date(expense.date);
      const key = date.toLocaleString('default', { month: 'short' });
      grouped[key] = (grouped[key] || 0) + expense.amount;
    });

    // If data is sparse, maybe fill in months? For now, just showing available points.
    return Object.keys(grouped).map(key => ({ name: key, value: grouped[key] }));
  }, [expenses]);

  const handleDownloadTrend = () => {
    const headers = ['Month', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...areaData.map(row => `${row.name},${row.value}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expense_trend.csv';
    link.click();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm">
          <h2 className="text-base font-medium text-gray-500 dark:text-gray-400">Total Spend</h2>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalSpend, currency)}</span>
            <span className="text-sm font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">+2.5% vs last month</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Updated just now</p>
        </div>

        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm flex items-center justify-center">
          <button
            onClick={onOpenNewExpense}
            className="w-full h-full min-h-[100px] flex flex-col items-center justify-center gap-2 text-primary hover:bg-primary/5 border-2 border-dashed border-primary/20 rounded-lg transition-colors"
          >
            <div className="p-3 bg-primary text-white rounded-full shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined">add</span>
            </div>
            <span className="font-semibold">Add Quick Expense</span>
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Expense Trend</h3>
            <button onClick={handleDownloadTrend} className="text-gray-400 hover:text-primary transition-colors" title="Download CSV">
              <span className="material-symbols-outlined">download</span>
            </button>
          </div>
          <div className="h-[300px] w-full">
            {areaData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => formatCurrency(value, currency).replace(/[0-9,.]/g, '') + value} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number) => [formatCurrency(value, currency), 'Spend']}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
            )}
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white dark:bg-card-dark p-6 rounded-xl border border-gray-200 dark:border-border-dark shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Spend by Category</h3>
            <button onClick={() => navigate('/expenses')} className="text-gray-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_horiz</span>
            </button>
          </div>
          <div className="flex-1 min-h-[250px] relative">
             {pieData.length > 0 ? (
                <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [formatCurrency(value, currency), 'Amount']}
                    />
                    <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        formatter={(value) => <span className="text-gray-600 dark:text-gray-300 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Text */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                   <div className="text-center">
                     <span className="block text-2xl font-bold text-gray-900 dark:text-white">{expenses.length}</span>
                     <span className="text-xs text-gray-500">Txns</span>
                   </div>
                </div>
                </>
             ) : (
                <div className="h-full flex items-center justify-center text-gray-500">No data available</div>
             )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-border-dark flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Transactions</h3>
          <button onClick={() => navigate('/expenses')} className="text-sm font-medium text-primary hover:text-primary-600">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-background-dark/50">
              <tr>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Merchant</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-border-dark">
              {recentTransactions.map((tx, i) => (
                <tr 
                  key={i} 
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/expenses/${tx.id}`)}
                >
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{tx.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{tx.merchant}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tx.category === 'Software' ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/10 dark:text-teal-400' : 
                        tx.category === 'Food' ? 'bg-orange-100 text-orange-800 dark:bg-orange-500/10 dark:text-orange-400' :
                        tx.category === 'Travel' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/10 dark:text-blue-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{formatCurrency(tx.amount, currency)}</td>
                  <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button className="text-gray-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
              {recentTransactions.length === 0 && (
                  <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent transactions</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
