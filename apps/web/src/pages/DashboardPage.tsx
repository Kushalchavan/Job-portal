import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useAnalyticsStore } from '../store';
import { LoadingSkeleton, ErrorState, EmptyState } from '../components/Common';
import {
  Sparkles,
  Briefcase,
  Building2,
  FileSpreadsheet,
  FileHeart,
  Users,
  UserPlus,
  ArrowRight,
  TrendingUp,
  PlusCircle,
  FileText,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { stats, isLoading, error, fetchDashboardStats } = useAnalyticsStore();

  useEffect(() => {
    fetchDashboardStats().catch(() => {});
  }, [fetchDashboardStats]);

  const onRetry = () => {
    fetchDashboardStats().catch(() => {});
  };

  if (isLoading) {
    return (
      <div className="space-y-6" id="dashboard-loading">
        <div className="h-10 w-2/3 bg-slate-200 dark:bg-slate-800 rounded animate-[pulse_1.2s_infinite]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LoadingSkeleton count={1} height="h-32" />
          <LoadingSkeleton count={1} height="h-32" />
          <LoadingSkeleton count={1} height="h-32" />
          <LoadingSkeleton count={1} height="h-32" />
        </div>
        <LoadingSkeleton count={3} height="h-16" />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // Define components for each user role
  const renderUserDashboard = () => {
    const userStats = stats?.userStats || {
      applicationsCount: 0,
      savedJobsCount: 0,
      resumesCount: 0,
    };

    return (
      <div className="space-y-8" id="user-dashboard">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-950/20">
          <div className="relative z-10 max-w-lg space-y-2">
            <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Applicant Terminal
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Aisles ahead, {user?.name}!
            </h1>
            <p className="text-sm text-indigo-100 leading-relaxed font-medium">
              Your professional profiles are loaded and synced with our AI matching core. Apply to open requirements or monitor pending recruiter status changes.
            </p>
            <div className="pt-2 flex gap-3">
              <Link
                to="/jobs"
                className="px-4 py-2 bg-white text-indigo-900 rounded-xl text-xs font-bold hover:bg-slate-50 shadow transition duration-155"
              >
                Search Careers
              </Link>
              <Link
                to="/resumes"
                className="px-4 py-2 bg-indigo-505 bg-indigo-600 border border-indigo-500/30 rounded-xl text-xs font-semibold hover:bg-indigo-500 transition duration-155"
              >
                Upload Resume
              </Link>
            </div>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none hidden md:flex items-center justify-center font-bold text-[180px] text-white">
            🚀
          </div>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Applications Submitted</span>
            <p className="text-3xl font-extrabold text-indigo-600 mt-2">{userStats.applicationsCount}</p>
            <div className="absolute right-4 bottom-4 p-2 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Saved Careers</span>
            <p className="text-3xl font-extrabold text-rose-500 mt-2">{userStats.savedJobsCount}</p>
            <div className="absolute right-4 bottom-4 p-2 bg-rose-50 dark:bg-rose-950/20 text-rose-500 dark:text-rose-400 rounded-xl">
              <FileHeart className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Uploaded Profiles</span>
            <p className="text-3xl font-extrabold text-amber-500 mt-2">{userStats.resumesCount}</p>
            <div className="absolute right-4 bottom-4 p-2 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-950 dark:text-slate-50">Quick Recommendations</h2>
              <Link to="/jobs" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1">
                Explore All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 divide-y divide-slate-100 dark:divide-slate-800">
              <p className="text-xs text-slate-500 pb-2">Careers fitted with your target criteria</p>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Staff Software Engineer</h4>
                  <p className="text-xs text-slate-500">RecruitAI Corp • Remote US</p>
                </div>
                <Link to="/jobs" className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100">
                  Inspect
                </Link>
              </div>
              <div className="py-3 flex justify-between items-center text-sm">
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">Senior Frontend Architect</h4>
                  <p className="text-xs text-slate-500">GrowthFlow Co • Fully Remote</p>
                </div>
                <Link to="/jobs" className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg hover:bg-indigo-100">
                  Inspect
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-50">Platform Shortcuts</h3>
            <div className="grid grid-cols-1 gap-2.5 text-sm font-semibold">
              <Link to="/profile" className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between transition text-slate-700 dark:text-slate-300">
                <span>Manage Profile Skills</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link to="/applications" className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between transition text-slate-700 dark:text-slate-300">
                <span>View Applications Status</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link to="/saved-jobs" className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between transition text-slate-700 dark:text-slate-300">
                <span>Configure saved list</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRecruiterDashboard = () => {
    const rStats = stats?.recruiterStats || {
      companiesCount: 0,
      jobsCount: 0,
      applicationsCount: 0,
      topCandidatesCount: 0,
    };

    return (
      <div className="space-y-8" id="recruiter-dashboard">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
              Recruiting Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Analyze applicant routing, administer company catalogs, and evaluate AI match metrics.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/companies/create"
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              Register Company
            </Link>
            <Link
              to="/jobs/create"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-100 dark:shadow-none transition inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post Job Position
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Registered Companies</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{rStats.companiesCount}</p>
            <div className="absolute right-3.5 bottom-3.5 text-indigo-500 p-1">
              <Building2 className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Active Positions</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{rStats.jobsCount}</p>
            <div className="absolute right-3.5 bottom-3.5 text-indigo-500 p-1">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Applicants</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{rStats.applicationsCount}</p>
            <div className="absolute right-3.5 bottom-3.5 text-indigo-500 p-1">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">High Match Profiles</span>
            <p className="text-3xl font-extrabold text-indigo-600 mt-1">{rStats.topCandidatesCount}</p>
            <div className="absolute right-3.5 bottom-3.5 text-indigo-500 p-1">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>

        {/* Main Content splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Active Recruiting Process</h3>
              <Link to="/analytics" className="text-xs font-bold text-indigo-600 inline-flex items-center gap-1 hover:underline">
                <TrendingUp className="w-3.5 h-3.5" /> View Funnel Analytics
              </Link>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4 text-center">
              <p className="text-xs text-slate-500">Awaiting your evaluation action</p>
              <div className="text-sm border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center">
                <div className="text-left">
                  <h4 className="font-semibold">Staff Frontend Architect Candidate</h4>
                  <p className="text-xs text-slate-500">Applicant: Jane Doe • JavaScript/React</p>
                </div>
                <button
                  onClick={() => navigate('/jobs')}
                  className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                >
                  Manage
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-50">Action Dashboard</h3>
            <div className="grid grid-cols-1 gap-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <Link to="/companies" className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between transition">
                <span>View Registered Entities</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link to="/jobs/my" className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between transition">
                <span>Manage My Active Jobs</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link to="/analytics" className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 rounded-xl flex items-center justify-between transition">
                <span>Open Recharts Analytics</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminDashboard = () => {
    const adminStats = stats?.adminStats || {
      usersCount: 0,
      recruitersCount: 0,
      jobsCount: 0,
      applicationsCount: 0,
    };

    return (
      <div className="space-y-8" id="admin-dashboard">
        {/* Title */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">
            Administration Panel
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System operations, metrics indicators, user block/unblock actions, and security handshakes.
          </p>
        </div>

        {/* Metric Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Candidate Accounts</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{adminStats.usersCount}</p>
            <Users className="absolute right-4 bottom-4 text-indigo-500 w-5 h-5 opacity-40" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Recruiter Accounts</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{adminStats.recruitersCount}</p>
            <UserPlus className="absolute right-4 bottom-4 text-indigo-500 w-5 h-5 opacity-40" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Active Position Limits</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{adminStats.jobsCount}</p>
            <Briefcase className="absolute right-4 bottom-4 text-indigo-500 w-5 h-5 opacity-40" />
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Total Applications</span>
            <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 mt-1">{adminStats.applicationsCount}</p>
            <FileSpreadsheet className="absolute right-4 bottom-4 text-indigo-500 w-5 h-5 opacity-40" />
          </div>
        </div>

        {/* Quick actions box */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-left space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-slate-100">User Management & Gating Controls</h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
            Review user registration queues, check compliance reporting, list and configure access permissions to block or unblock users as needed.
          </p>
          <div className="pt-2">
            <Link
              to="/admin/users"
              className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition"
            >
              Access Gating Console
            </Link>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return <EmptyState title="Profile identity missing" description="Please complete login handshake to synchronize data credentials." />;
  }

  switch (user.role) {
    case 'ADMIN':
      return renderAdminDashboard();
    case 'RECRUITER':
      return renderRecruiterDashboard();
    case 'USER':
    default:
      return renderUserDashboard();
  }
};
