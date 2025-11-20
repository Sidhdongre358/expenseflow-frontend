
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Modal } from './components/Modal';
import { ChatBot } from './components/ChatBot';
import { Dashboard } from './pages/Dashboard';
import { Expenses } from './pages/Expenses';
import { ExpenseDetails } from './pages/ExpenseDetails';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { LandingPage } from './pages/LandingPage';
import { AddExpense } from './pages/AddExpense';
import { Notifications } from './pages/Notifications';
import { Budgets } from './pages/Budgets';
import { Profile } from './pages/Profile';
import { TeamSettings } from './pages/TeamSettings';
import { OrgSettings } from './pages/OrgSettings';
import { Billing } from './pages/Billing';

import { useAppDispatch, useAppSelector } from './store/hooks';
import { setSidebarOpen, setTheme } from './features/ui/uiSlice';
import { fetchUser } from './features/user/userSlice';
import { fetchMyOrgs, fetchOrgMembers } from './features/org/orgSlice';
import { fetchExpenses } from './features/expenses/expensesSlice';
import { fetchBudgets } from './features/budgets/budgetsSlice';

const Layout: React.FC<{ 
  children: React.ReactNode; 
  onOpenNewExpense: () => void;
}> = ({ children, onOpenNewExpense }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
  
  // Don't show sidebar/header on login, signup, or landing page
  if (location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/landing') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Sidebar 
        onLogout={() => window.location.hash = '/login'} 
        isOpen={isSidebarOpen}
        onClose={() => dispatch(setSidebarOpen(false))}
      />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
        <Header 
          onOpenNewExpense={onOpenNewExpense} 
          onToggleSidebar={() => dispatch(setSidebarOpen(true))}
          title={
            location.pathname === '/' ? 'Dashboard' :
            location.pathname.startsWith('/expenses') ? 'Expenses' :
            location.pathname === '/notifications' ? 'Notifications' :
            location.pathname === '/budgets' ? 'Budgets' :
            location.pathname === '/settings' ? 'User Settings' : 
            location.pathname === '/profile' ? 'Profile' : 
            location.pathname === '/team' ? 'Team Management' :
            location.pathname === '/org-settings' ? 'Organization Settings' : 
            location.pathname === '/billing' ? 'Billing' : 'Page'
          }
        />
        <main className="flex-1 overflow-y-auto scroll-smooth">
          {children}
        </main>
        {/* AI Chatbot Overlay */}
        <ChatBot />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isDark = useAppSelector((state) => state.ui.isDark);
  const { activeOrgId } = useAppSelector((state) => state.orgs);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

  // Initial Theme Setup
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Bootstrap Data
  useEffect(() => {
    dispatch(fetchUser());
    dispatch(fetchMyOrgs());
  }, [dispatch]);

  // When active org changes, fetch data
  useEffect(() => {
      if (activeOrgId) {
          dispatch(fetchExpenses());
          dispatch(fetchBudgets());
          // Fetch members to ensure RBAC in sidebar works correctly
          dispatch(fetchOrgMembers());
      }
  }, [activeOrgId, dispatch]);

  return (
    <HashRouter>
      <Layout 
        onOpenNewExpense={() => setIsNewExpenseOpen(true)}
      >
        <Routes>
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Dashboard onOpenNewExpense={() => setIsNewExpenseOpen(true)} />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/:id" element={<ExpenseDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* SaaS Admin Routes */}
          <Route path="/team" element={<TeamSettings />} />
          <Route path="/org-settings" element={<OrgSettings />} />
          <Route path="/billing" element={<Billing />} /> 
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Modal
          isOpen={isNewExpenseOpen}
          onClose={() => setIsNewExpenseOpen(false)}
          title="Add New Expense"
          size="lg"
        >
          <AddExpense onClose={() => setIsNewExpenseOpen(false)} />
        </Modal>
      </Layout>
    </HashRouter>
  );
};

export default App;
