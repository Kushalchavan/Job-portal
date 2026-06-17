import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Sparkles } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: Array<'USER' | 'RECRUITER' | 'ADMIN'>;
}

export const ProtectedLayout: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isInitialized, initializeAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    initializeAuth().catch(() => {});
  }, [initializeAuth]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center max-w-sm text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-extrabold text-3xl shadow-xl shadow-indigo-200 dark:shadow-none animate-bounce">
              R
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 p-1 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-1">
            RecruitAI Platform
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
            Verifying secure session tokens and refreshing handshake credentials...
          </p>
          <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-[loading_1.5s_infinite_ease-in-out]" style={{
              width: '80%',
              animationName: 'shimmer',
            }} />
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login, preserving location for post-auth routing
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role Gate checks
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8">
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-lg flex items-center justify-center mx-auto mb-4">
            🛡️
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Access Restricted
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            Your user account role of <strong className="text-indigo-600">{user.role}</strong> does not possess permission to access the requested admin/recruiter route:
            <br />
            <code className="text-xs bg-slate-100 dark:bg-slate-950 p-1.5 rounded mt-3 block font-mono text-slate-700 dark:text-slate-300">
              {location.pathname}
            </code>
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950" id="secured-root-container">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-16 min-h-[calc(100vh-64px)]">
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Mobile backdrop shadow */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-slate-900/60 backdrop-blur-xs md:hidden"
            id="mobile-sidebar-backdrop"
          />
        )}

        {/* Core content slot */}
        <main className="flex-1 w-full md:left-64 md:pl-64 p-4 md:p-8 transition-all duration-200 overflow-x-hidden">
          <div className="max-w-6xl mx-auto space-y-6" id="outlet-main-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
