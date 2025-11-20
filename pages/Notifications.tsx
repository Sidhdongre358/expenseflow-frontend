
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '../features/notifications/notificationsSlice';
import { formatTimeAgo } from '../utils/formatters';

export const Notifications: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: notifications, status } = useAppSelector((state) => state.notifications);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchNotifications());
    }
  }, [dispatch, status]);

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'unread') return !n.read;
    return true;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  if (status === 'loading' && notifications.length === 0) {
    return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stay updated with your latest activity.</p>
        </div>
        <div className="flex gap-3 items-center">
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <button 
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'all' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setActiveTab('unread')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'unread' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    Unread
                </button>
            </div>
            <button 
                onClick={handleMarkAllRead}
                className="text-sm font-medium text-primary hover:text-primary-600 dark:hover:text-primary-400 transition-colors whitespace-nowrap"
            >
            Mark all as read
            </button>
        </div>
      </div>

      <div className="space-y-3">
        {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
            <div
                key={notification.id}
                className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 group ${
                notification.read
                    ? 'bg-white dark:bg-card-dark border-gray-200 dark:border-border-dark opacity-90'
                    : 'bg-white dark:bg-card-dark border-blue-200 dark:border-blue-900/50 shadow-sm relative overflow-hidden'
                }`}
            >
                {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                )}
                
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1 ${
                    notification.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    notification.type === 'danger' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                    <span className="material-symbols-outlined text-[20px]">
                        {notification.type === 'success' ? 'check_circle' :
                        notification.type === 'warning' ? 'warning' :
                        notification.type === 'danger' ? 'error' : 'info'}
                    </span>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                        <h3 className={`text-sm font-semibold truncate ${notification.read ? 'text-gray-700 dark:text-gray-200' : 'text-gray-900 dark:text-white'}`}>
                            {notification.title}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex-shrink-0">
                                {formatTimeAgo(notification.timestamp)}
                            </span>
                            {!notification.read && (
                                <button 
                                    onClick={() => handleMarkRead(notification.id)}
                                    className="text-[10px] font-medium text-primary hover:text-primary-600 dark:hover:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Mark read
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed pr-8">{notification.description}</p>
                </div>
            </div>
            ))
        ) : (
            <div className="py-16 text-center bg-white dark:bg-card-dark rounded-xl border border-dashed border-gray-200 dark:border-border-dark">
                <div className="inline-flex p-4 rounded-full bg-gray-50 dark:bg-gray-800 mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">notifications_off</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No notifications</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">You're all caught up!</p>
            </div>
        )}
        
        {filteredNotifications.length > 0 && (
            <div className="pt-4 text-center">
                <button className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
                    View older notifications
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
