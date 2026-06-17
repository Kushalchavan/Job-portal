import React, { useEffect } from 'react';
import { useNotificationStore, useAuthStore } from '../store';
import { Bell, Eye, EyeOff, CheckCheck, Trash2 } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';

export const NotificationPage: React.FC = () => {
  const { user } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading, error } = useNotificationStore();

  useEffect(() => {
    if (user) {
      fetchNotifications().catch(() => {});
    }
  }, [fetchNotifications, user]);

  return (
    <div className="space-y-6" id="notifications-dashboard">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Bell className="w-7 h-7 text-indigo-600" />
            Core Notifications Logs
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Stay synchronised on candidate reviews, AI evaluations and application statuses.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead().catch(() => {})}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-150 border border-indigo-200 text-indigo-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-20" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchNotifications()} />
      ) : notifications.length === 0 ? (
        <EmptyState title="All Caught Up!" description="No notifications have been recorded on file." />
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 flex justify-between items-start gap-4 transition ${
                !n.isRead ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm ${!n.isRead ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-350'}`}>
                    {n.title}
                  </h3>
                  {!n.isRead && (
                    <span className="w-2 h-2 bg-rose-500 rounded-full inline-block animate-pulse" />
                  )}
                </div>

                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-400 block mt-2">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id).catch(() => {})}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-indigo-600 rounded-lg cursor-pointer transition"
                  title="Mark as Read"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
