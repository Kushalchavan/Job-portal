import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSavedJobsStore, useAuthStore } from '../store';
import { Bookmark, MapPin, Clock, Trash } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';

export const SavedJobsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { savedJobs, fetchSavedJobs, unsaveJob, isLoading, error } = useSavedJobsStore();

  useEffect(() => {
    if (user) {
      fetchSavedJobs().catch(() => {});
    }
  }, [fetchSavedJobs, user]);

  const handleUnsave = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
    } catch {
      alert('Unsaved successfully.');
    }
  };

  return (
    <div className="space-y-6" id="saved-jobs-list">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <Bookmark className="w-7 h-7 text-indigo-600" />
          My Saved Careers Bookmark
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review bookmarked configurations, monitor recruiter hiring statuses, or start application pipelines.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} height="h-28" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchSavedJobs()} />
      ) : savedJobs.length === 0 ? (
        <EmptyState
          title="No Saved Careers"
          description="Find interesting openings during search, and bookmark them."
          action={
            <Link to="/jobs" className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg shadow">
              Search Careers Directory
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition"
            >
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-50">
                  <Link to={`/jobs/${job.id}`} className="hover:text-indigo-600 text-base">
                    {job.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-500 font-semibold">{job.companyName}</p>

                <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1.5">
                    Salary: <span className="text-slate-700 dark:text-slate-200 font-semibold">{job.salaryRange}</span>
                  </span>
                </div>
              </div>

              <div className="flex gap-2 self-stretch sm:self-auto justify-end border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                <button
                  onClick={() => handleUnsave(job.id)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg cursor-pointer"
                  title="Unsave Job Bookmarks"
                >
                  <Trash className="w-4 h-4 text-rose-500" />
                </button>
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold transition"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
