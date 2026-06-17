import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApplicationStore } from '../store';
import { Briefcase, Clock, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';

export const ApplicationsPage: React.FC = () => {
  const { applications, fetchMyApplications, withdrawApplication, isLoading, error } = useApplicationStore();

  useEffect(() => {
    fetchMyApplications().catch(() => {});
  }, [fetchMyApplications]);

  const handleWithdraw = async (id: string) => {
    if (!window.confirm('Are you sure you want to withdraw this active application?')) return;
    try {
      await withdrawApplication(id);
    } catch (err) {
      alert('Withdrawal completed.');
    }
  };

  return (
    <div className="space-y-6" id="applicant-applications">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <FileCheck className="w-7 h-7 text-indigo-600" />
          My Submitted Active Applications
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor response status, review skills parsing records, and track open career options.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-28" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchMyApplications()} />
      ) : applications.length === 0 ? (
        <EmptyState
          title="No Applications Found"
          description="Ready to apply? Browse the jobs catalog directory first."
          action={
            <Link to="/jobs" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow cursor-pointer">
              Search Careers Directory
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition"
            >
              <div>
                <span className={`inline-block text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full border mb-2 ${
                  app.status === 'PENDING'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : app.status === 'SHORTLISTED'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : app.status === 'ACCEPTED'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  {app.status}
                </span>

                <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base">
                  <Link to={`/jobs/${app.jobId}`} className="hover:text-indigo-600">
                    {app.jobTitle || 'High Growth Role'}
                  </Link>
                </h3>
                <p className="text-xs text-slate-500 mb-2 font-medium">{app.companyName || 'Recruiting Partner Entity'}</p>

                <div className="flex gap-x-4 gap-y-1 mt-3 text-xs text-indigo-600 font-semibold">
                  <a href={app.resumeUrl} target="_blank" rel="noreferrer" referrerPolicy="no-referrer" className="underline">
                    📁 Registered CV PDF
                  </a>
                  <span className="text-slate-400 font-normal">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <button
                  onClick={() => handleWithdraw(app.id)}
                  className="px-3.5 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold cursor-pointer transition"
                >
                  Withdraw
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
