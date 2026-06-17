import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  Server,
  LogOut,
  User as UserIcon,
  Briefcase,
  Layers,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAuthStore, useNotificationStore } from '../store';
import { getApiUrl, setApiUrl } from '../services/api';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchNotifications, notifications, markAsRead } = useNotificationStore();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  
  const [customApiUrl, setCustomApiUrl] = useState(getApiUrl());

  useEffect(() => {
    if (user) {
      fetchNotifications().catch(() => {});
      // Refresh notifications periodically
      const interval = setInterval(() => {
        fetchNotifications().catch(() => {});
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchNotifications]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setApiUrl(customApiUrl);
    setShowConfigModal(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm px-4 md:px-6 flex items-center justify-between" id="platform-navbar">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
          aria-label="Toggle Navigation Sidebar"
          id="toggle-sidebar-nav"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200 dark:shadow-none">
            R
          </div>
          <span className="font-semibold text-lg text-slate-900 dark:text-slate-50 tracking-tight hidden sm:inline-block">
            Recruit<span className="text-indigo-600 font-extrabold">AI</span>
          </span>
        </Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Backend Endpoint Status indicator */}
        <button
          onClick={() => {
            setCustomApiUrl(getApiUrl());
            setShowConfigModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full font-medium transition cursor-pointer"
          id="config-endpoint-btn"
          title="Configure Target API Server"
        >
          <Server className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden md:inline-block truncate max-w-[160px]">{getApiUrl()}</span>
          <span className="md:hidden">API</span>
        </button>

        {user && (
          <>
            {/* Notifications and bell */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition relative cursor-pointer"
                id="notifications-bell"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-[10px] text-white font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden"
                  id="notifications-dropdown"
                >
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-xs font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        No notifications found.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            if (!notif.isRead) markAsRead(notif.id);
                            navigate('/notifications');
                            setShowNotifications(false);
                          }}
                          className={`p-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition ${
                            !notif.isRead ? 'bg-indigo-50/40 dark:bg-indigo-950/10' : ''
                          }`}
                        >
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mb-0.5">
                            {notif.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(notif.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifications(false)}
                    className="block text-center py-2.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-xs text-indigo-600 font-semibold hover:text-indigo-700 transition"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition text-slate-700 dark:text-slate-200 cursor-pointer"
                id="profile-dropdown-btn"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500/80 flex items-center justify-center text-white font-medium text-sm shadow">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold leading-none">{user.name}</p>
                  <span className="text-[9px] font-medium leading-none text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/30 rounded mt-0.5 inline-block">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {showProfileMenu && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                  id="profile-menu-dropdown"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 sm:hidden">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    My Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/notifications');
                      setShowProfileMenu(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
                  >
                    <Bell className="w-4 h-4 text-slate-400" />
                    Notifications
                  </button>

                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Target Backend API Configuration Pop-up Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2 mb-2">
              <Server className="w-5 h-5 text-indigo-600" />
              API Server Configuration
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Ensure that all queries correctly route to your existing backend. Change this address if your backend is hosted elsewhere or on a custom port.
            </p>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Target Backend URL
                </label>
                <input
                  type="url"
                  required
                  value={customApiUrl}
                  onChange={(e) => setCustomApiUrl(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-slate-900 dark:text-slate-50"
                  placeholder="https://api.example.com/api"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCustomApiUrl('https://ais-dev-gtylpwn636ysgdybbcev4z-1018900589628.asia-southeast1.run.app/api')}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-center font-medium"
                >
                  Reset Default
                </button>
                <button
                  type="button"
                  onClick={() => setCustomApiUrl('http://localhost:3000/api')}
                  className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-center font-medium"
                >
                  Localhost (3000)
                </button>
              </div>

              <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Apply & Refresh
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};
