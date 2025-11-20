
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateOrgSettings } from '../features/org/orgSlice';
import { formatCurrency } from '../utils/formatters';

export const Billing: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activeOrg } = useAppSelector(state => state.orgs);
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePlanChange = async (plan: 'Free' | 'Pro' | 'Enterprise') => {
    if (activeOrg?.plan === plan) return;
    
    if (window.confirm(`Are you sure you want to switch to the ${plan} plan?`)) {
      setIsUpdating(true);
      try {
          await dispatch(updateOrgSettings({ plan })).unwrap();
      } catch (e) {
          console.error("Failed to update plan", e);
      } finally {
          setIsUpdating(false);
      }
    }
  };

  const plans = [
    {
      id: 'Free',
      name: 'Starter',
      price: 0,
      description: 'Perfect for small teams and startups.',
      features: ['Up to 5 Members', 'Basic Expense Tracking', '7-Day Audit Log', 'Email Support'],
      color: 'bg-gray-50 dark:bg-gray-800'
    },
    {
      id: 'Pro',
      name: 'Growth',
      price: 29,
      description: 'For growing businesses that need more control.',
      features: ['Up to 50 Members', 'Advanced Budgets', 'Unlimited Audit Log', 'Priority Support', 'Receipt Scanning'],
      color: 'bg-primary/5 border-primary dark:bg-primary/10'
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      price: null, // Custom
      description: 'Advanced security and support for large organizations.',
      features: ['Unlimited Members', 'SSO Integration', 'Dedicated Account Manager', 'Custom Contracts', 'API Access'],
      color: 'bg-purple-50 dark:bg-purple-900/10'
    }
  ];

  // Mock Data for UI
  const invoices = [
      { id: 'INV-001', date: 'Oct 1, 2023', amount: 29.00, status: 'Paid' },
      { id: 'INV-002', date: 'Sep 1, 2023', amount: 29.00, status: 'Paid' },
      { id: 'INV-003', date: 'Aug 1, 2023', amount: 29.00, status: 'Paid' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Billing & Subscription</h1>
         <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your plan, payment details, and invoices for <span className="font-semibold">{activeOrg?.name}</span>.</p>
      </div>

      {/* Current Plan Summary */}
      <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 text-primary rounded-full">
                  <span className="material-symbols-outlined text-2xl">diamond</span>
              </div>
              <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Plan</p>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeOrg?.plan} Plan</h2>
              </div>
          </div>
          <div className="flex gap-4 text-sm">
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Next Payment</p>
                  <p className="font-semibold text-gray-900 dark:text-white">Nov 1, 2023</p>
              </div>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                  <p className="font-semibold text-gray-900 dark:text-white">$29.00</p>
              </div>
          </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Available Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => {
            const isCurrent = activeOrg?.plan === plan.id;
            return (
                <div 
                    key={plan.id} 
                    className={`rounded-2xl border p-6 flex flex-col h-full transition-all ${isCurrent ? 'border-primary ring-1 ring-primary ' + plan.color : 'border-gray-200 dark:border-border-dark bg-white dark:bg-card-dark hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 min-h-[40px]">{plan.description}</p>
                    </div>
                    <div className="mb-6">
                        <div className="flex items-baseline">
                            <span className="text-3xl font-bold text-gray-900 dark:text-white">{plan.price !== null ? `$${plan.price}` : 'Custom'}</span>
                            {plan.price !== null && <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>}
                        </div>
                    </div>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                        {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <span className="material-symbols-outlined text-green-500 text-lg">check</span>
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handlePlanChange(plan.id as any)}
                        disabled={isCurrent || isUpdating}
                        className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isCurrent 
                            ? 'bg-green-100 text-green-700 cursor-default dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-primary text-white hover:bg-primary-600 shadow-lg shadow-primary/20'
                        } disabled:opacity-50`}
                    >
                        {isCurrent ? 'Current Plan' : 'Upgrade'}
                    </button>
                </div>
            );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Method */}
          <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                  <button className="text-sm text-primary hover:underline">Edit</button>
              </div>
              <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="w-12 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center text-xs font-bold text-gray-500">VISA</div>
                  <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Visa ending in 4242</p>
                      <p className="text-xs text-gray-500">Expiry 12/2025</p>
                  </div>
              </div>
          </section>

          {/* Invoice History */}
          <section className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-border-dark overflow-hidden p-6">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice History</h2>
                  <button className="text-sm text-primary hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                  {invoices.map(inv => (
                      <div key={inv.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                          <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                                  <span className="material-symbols-outlined text-lg">description</span>
                              </div>
                              <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">Invoice #{inv.id}</p>
                                  <p className="text-xs text-gray-500">{inv.date}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">${inv.amount.toFixed(2)}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold uppercase rounded-md">{inv.status}</span>
                              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                  <span className="material-symbols-outlined text-lg">download</span>
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      </div>
    </div>
  );
};
