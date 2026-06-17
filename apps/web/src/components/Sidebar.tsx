import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Layers,
  FileSpreadsheet,
  FileHeart,
  BarChart3,
  Users,
  Bell,
  Sparkles,
  UserCircle2,
} from 'lucide-react';
import { useAuthStore } from '../store';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuthStore();
  const role = user?.role;

  const getLinks = () => {
    const common = [
      { to: '/', label: 'Overview', icon: LayoutDashboard },
      { to: '/profile', label: 'My Profile', icon: UserCircle2 },
    ];

    if (role === 'USER') {
      return [
        ...common,
        { to: '/jobs', label: 'Search Jobs', icon: Briefcase },
        { to: '/applications', label: 'My Applications', icon: FileSpreadsheet },
        { to: '/resumes', label: 'My Resumes', icon: FileHeart },
        { to: '/saved-jobs', label: 'Saved Jobs', icon: FileHeart },
        { to: '/notifications', label: 'Notifications', icon: Bell },
      ];
    }

    if (role === 'RECRUITER') {
      return [
        ...common,
        { to: '/companies', label: 'Companies', icon: Building2 },
        { to: '/jobs', label: 'All Jobs', icon: Briefcase },
        { to: '/jobs/my', label: 'My Posted Jobs', icon: Layers },
        { to: '/analytics', label: 'Analytics', icon: BarChart3 },
        { to: '/notifications', label: 'Notifications', icon: Bell },
      ];
    }

    if (role === 'ADMIN') {
      return [
        ...common,
        { to: '/admin/users', label: 'Manage Users', icon: Users },
        { to: '/notifications', label: 'Notifications', icon: Bell },
      ];
    }

    return common;
  };

  const navLinks = getLinks();

  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-30 w-64 bg-white border-r border-slate-200 text-slate-800 transform transition-transform duration-250 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      id="navigation-sidebar"
    >
      <div className="flex flex-col h-full justify-between py-4 select-none">
        {/* Main Nav Section */}
        <div className="px-3 space-y-1.5 flex-1 overflow-y-auto">
          {/* User profile capsule */}
          {user && (
            <div className="px-4 py-4 mb-4 bg-slate-50 rounded-xl border border-slate-200 text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Logged In Role
              </p>
              <p className="text-sm font-bold text-slate-800 mt-0.5 max-w-[200px] truncate">
                {user.name}
              </p>
              <span className="inline-flex mt-2.5 items-center gap-1.5 text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md border border-indigo-200">
                <Sparkles className="w-3 h-3" />
                {role}
              </span>
            </div>
          )}

          <p className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Main Navigation
          </p>

          <nav className="space-y-1">
            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 font-bold border-l-4 border-indigo-600 rounded-r-lg rounded-l-none pl-2.5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                  id={`nav-link-${link.to.replace(/\//g, '') || 'home'}`}
                >
                  <IconComp className="w-4 h-4 flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer Credit indicator */}
        <div className="px-6 py-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
          <p className="font-semibold text-slate-400">Target Server Node</p>
          <div className="text-[10px] mt-1.5 font-mono text-indigo-600 font-bold truncate bg-slate-50 border border-slate-100 p-1.5 rounded-lg">
            CONNECTED MODE
          </div>
        </div>
      </div>
    </aside>
  );
};
