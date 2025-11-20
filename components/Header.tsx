
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchNotifications } from '../features/notifications/notificationsSlice';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  onOpenNewExpense: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenNewExpense, onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((state) => state.user);
  const { items: notifications } = useAppSelector((state) => state.notifications);
  
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter(n => !n.read).length;
  const defaultAvatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaCW9ApT-LOl3Y8MjK67KDgi0WXUo0Jk8z-KBiyg6UTRhftITBHqdNe5D0rt4OUTA8dyIu5h-YOLx_bDuuoLQ0XW0LVLH7tYWg4isvWm94ysrzeSWIqg-69CY1SlxMjy1LiWnTT0op-2fRJeXbrz86g9f1Bu88bjXdEXwchJwdlqZIBC4frlER-b4Sj3BQG9IgsHxNiCcQeoZ836j0wQtGosHx-A_2nGzBlj332SRGsbCuUQQi7rwaahiasJ8pKBqyiGchQxLZp4s';

  return (
    <header className="flex items-center justify-between px-4 md:px-6 py-4 bg-white dark:bg-card-dark border-b border-gray-200 dark:border-border-dark h-20 shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleSidebar}
          className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{title || 'Dashboard'}</h1>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <button 
          onClick={() => navigate('/notifications')}
          className="relative p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-warning rounded-full ring-2 ring-white dark:ring-card-dark"></span>
          )}
        </button>

        <button
           onClick={onOpenNewExpense}
           className="hidden sm:flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>New Expense</span>
        </button>
        
        <button
           onClick={onOpenNewExpense}
           className="sm:hidden flex items-center justify-center p-2 bg-primary hover:bg-primary-600 text-white rounded-lg transition-colors shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined text-xl">add</span>
        </button>

        {/* User Avatar Link */}
        <button 
          onClick={() => navigate('/profile')}
          className="w-9 h-9 rounded-full bg-cover bg-center border border-gray-200 dark:border-gray-700 shadow-sm transition-transform hover:scale-105 ml-1"
          style={{
            backgroundImage: `url("${profile?.avatar || defaultAvatar}")`
          }}
        ></button>
      </div>
    </header>
  );
};
