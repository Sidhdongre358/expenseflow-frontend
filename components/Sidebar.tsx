
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { OrgSwitcher } from './OrgSwitcher';

interface SidebarProps {
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onLogout, isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useAppSelector((state) => state.user);
  const { members } = useAppSelector((state) => state.orgs);
  
  // RBAC Check
  const currentMember = members.find(m => m.userId === profile?.id);
  const isAdmin = currentMember?.role === 'admin';

  const menuItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/' },
    { name: 'Expenses', icon: 'receipt_long', path: '/expenses' },
    { name: 'Reports', icon: 'bar_chart', path: '/reports' },
    { name: 'Budgets', icon: 'wallet', path: '/budgets' },
  ];

  const adminItems = [
      { name: 'Team', icon: 'group', path: '/team' },
      { name: 'Settings', icon: 'settings', path: '/org-settings' },
      { name: 'Billing', icon: 'credit_card', path: '/billing' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaCW9ApT-LOl3Y8MjK67KDgi0WXUo0Jk8z-KBiyg6UTRhftITBHqdNe5D0rt4OUTA8dyIu5h-YOLx_bDuuoLQ0XW0LVLH7tYWg4isvWm94ysrzeSWIqg-69CY1SlxMjy1LiWnTT0op-2fRJeXbrz86g9f1Bu88bjXdEXwchJwdlqZIBC4frlER-b4Sj3BQG9IgsHxNiCcQeoZ836j0wQtGosHx-A_2nGzBlj332SRGsbCuUQQi7rwaahiasJ8pKBqyiGchQxLZp4s';

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-card-dark border-r border-gray-200 dark:border-border-dark transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-4 justify-between">
          <div className="flex flex-col gap-2">
            {/* Close Button (Mobile Only) */}
            <div className="flex justify-end md:hidden mb-2">
                <button 
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Org Switcher Replaces Logo Area */}
            <OrgSwitcher />

            {/* Navigation */}
            <nav className="flex flex-col gap-1 mt-4">
              <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</div>
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive(item.path) ? 'filled' : ''}`}
                    style={{ fontSize: '20px' }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.name}</span>
                </button>
              ))}

              {/* Admin Section - Only visible to Admins */}
              {isAdmin && (
                  <>
                    <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">Admin</div>
                    {adminItems.map((item) => (
                        <button
                        key={item.path}
                        onClick={() => handleNavigate(item.path)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                            isActive(item.path)
                            ? 'bg-primary/10 text-primary dark:text-primary-400'
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                        }`}
                        >
                        <span
                            className={`material-symbols-outlined ${isActive(item.path) ? 'filled' : ''}`}
                            style={{ fontSize: '20px' }}
                        >
                            {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.name}</span>
                        </button>
                    ))}
                  </>
              )}
            </nav>
          </div>

          <div className="flex flex-col gap-4">
             {/* User Profile */}
             <div className="pt-4 border-t border-gray-200 dark:border-border-dark">
              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                <div 
                  className="flex items-center gap-3 flex-1 cursor-pointer"
                  onClick={() => handleNavigate('/profile')}
                >
                  <div
                    className="bg-center bg-no-repeat bg-cover rounded-full size-9"
                    style={{
                      backgroundImage: `url("${profile?.avatar || defaultAvatar}")`,
                    }}
                  ></div>
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{profile?.name || 'Loading...'}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentMember?.role || 'Member'}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Logout"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
