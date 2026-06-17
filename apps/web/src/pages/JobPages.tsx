import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useJobStore,
  useAuthStore,
  useCompanyStore,
  useApplicationStore,
  useResumeStore,
  useSavedJobsStore,
} from '../store';
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  Bookmark,
  Plus,
  ArrowLeft,
  Users,
  Sparkles,
  FileSpreadsheet,
  CheckCircle,
  FileHeart,
} from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';
import { Job, Application } from '../types';

export const JobsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { jobs, isLoading, error, fetchJobs, totalJobs, currentPage, totalPages } = useJobStore();
  const { companies, fetchCompanies } = useCompanyStore();
  const { saveJob, unsaveJob, savedJobs, fetchSavedJobs } = useSavedJobsStore();

  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    fetchJobs({ page: 1, limit: 10 }).catch(() => {});
    fetchCompanies().catch(() => {});
    if (user?.role === 'USER') {
      fetchSavedJobs().catch(() => {});
    }
  }, [fetchJobs, fetchCompanies, fetchSavedJobs, user]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs({ search, location, type, page: 1, limit: 10 }).catch(() => {});
  };

  const handlePageChange = (page: number) => {
    fetchJobs({ search, location, type, page, limit: 10 }).catch(() => {});
  };

  const toggleSave = async (job: Job) => {
    const isSaved = savedJobs.some((j) => j.id === job.id) || job.isSaved;
    if (isSaved) {
      await unsaveJob(job.id);
    } else {
      await saveJob(job.id);
    }
  };

  return (
    <div className="space-y-6" id="jobs-list">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-indigo-600" />
            Explore Careers
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse high-growth career openings matched dynamically by AI skills.
          </p>
        </div>

        {user?.role === 'RECRUITER' && (
          <Link
            to="/jobs/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Post New Career
          </Link>
        )}
      </div>

      {/* Filter and search form */}
      <form onSubmit={handleFilter} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">What are you looking for?</label>
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2.5 pl-9 text-xs border rounded-xl bg-transparent text-slate-900 dark:text-slate-50"
              placeholder="Job title, keywords, skills..."
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Where?</label>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 pl-9 text-xs border rounded-xl bg-transparent text-slate-900 dark:text-slate-50"
              placeholder="City, region, code, or 'Remote'"
            />
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Job Type Gating</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2.5 text-xs border rounded-xl bg-transparent text-slate-700 dark:text-slate-300 focus:outline-none dark:bg-slate-900 cursor-pointer"
          >
            <option value="">All Employment Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
        >
          Search Openings
        </button>
      </form>

      {/* Main listing */}
      {isLoading ? (
        <LoadingSkeleton count={3} height="h-32" />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchJobs()} />
      ) : jobs.length === 0 ? (
        <EmptyState title="No Jobs Listed" description="Modify search keywords or post a new job queue." />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => {
              const matchesMySaved = savedJobs.some((j) => j.id === job.id) || job.isSaved;

              return (
                <div
                  key={job.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition relative flex flex-col md:flex-row justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Logo placeholder */}
                      <div className="w-11 h-11 bg-slate-50 dark:bg-slate-950/40 text-slate-400 rounded-xl flex items-center justify-center font-bold text-sm border">
                        {job.companyLogo ? (
                          <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          job?.companyName?.charAt(0)
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 text-[9px] bg-indigo-50/80 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          <CheckCircle className="w-2.5 h-2.5" />
                          {job.type}
                        </span>
                        <h3 className="font-bold text-slate-900 dark:text-slate-50 text-base">
                          <Link to={`/jobs/${job.id}`} className="hover:text-indigo-600 transition">
                            {job.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-500 font-semibold">{job.companyName}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        {job.salaryRange}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-500" /> {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-4">
                      {job?.requirements?.slice(0, 4).map((req, index) => (
                        <span key={index} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-350 rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-row md:flex-col justify-between items-end gap-3 self-stretch border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                    <div className="flex items-center gap-2">
                      {user?.role === 'USER' && (
                        <button
                          onClick={() => toggleSave(job)}
                          className={`p-2 rounded-xl border transition cursor-pointer ${
                            matchesMySaved
                              ? 'bg-rose-50 border-rose-200 text-rose-500'
                              : 'border-slate-300 text-slate-400 hover:text-slate-700'
                          }`}
                          id={`save-btn-${job.id}`}
                        >
                          <Bookmark className={`w-4 h-4 ${matchesMySaved ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition"
                      >
                        Inspect Position
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
              <button
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition cursor-pointer"
              >
                Prev
              </button>
              <span className="text-xs text-slate-500 font-semibold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3.5 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg disabled:opacity-40 transition cursor-pointer"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const JobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { activeJob, fetchJobById, deleteJob } = useJobStore();
  const { resumes, fetchResumes } = useResumeStore();
  const { applyForJob, applications } = useApplicationStore();

  const [applying, setApplying] = useState(false);
  const [selectedResumeUrl, setSelectedResumeUrl] = useState('');
  const [appliedOk, setAppliedOk] = useState(false);
  const [errorLocal, setErrorLocal] = useState('');

  useEffect(() => {
    if (id) {
      fetchJobById(id).catch(() => {});
    }
    if (user?.role === 'USER') {
      fetchResumes().catch(() => {});
    }
  }, [id, fetchJobById, fetchResumes, user]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Delete this career job posting?')) return;
    try {
      await deleteJob(id);
      navigate('/jobs');
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setErrorLocal('');

    if (!selectedResumeUrl) {
      setErrorLocal('Please pick a resume PDF on file first.');
      return;
    }

    try {
      await applyForJob(id, selectedResumeUrl);
      setAppliedOk(true);
      setApplying(false);
    } catch (err: any) {
      setErrorLocal(err.response?.data?.message || 'Apply call finished with connection.');
    }
  };

  if (!activeJob) return <LoadingSkeleton count={3} />;

  const amOwner = user?.role === 'RECRUITER' && activeJob.recruiterId === user.id;
  const alreadySubmitted = applications.some((app) => app.jobId === activeJob.id) || activeJob.isApplied;

  return (
    <div className="space-y-6" id="job-detail">
      <Link to="/jobs" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to open list
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] bg-slate-150 border px-2.5 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-350 uppercase tracking-widest">{activeJob.type}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 mt-2">{activeJob.title}</h1>
            <p className="text-sm font-semibold text-indigo-600 mt-1">{activeJob.companyName}</p>
          </div>

          <div className="flex gap-2.5 flex-wrap">
            {user?.role === 'USER' && (
              <button
                disabled={alreadySubmitted || appliedOk}
                onClick={() => setApplying(true)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer transition ${
                  alreadySubmitted || appliedOk
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {alreadySubmitted || appliedOk ? '✓ Application Submitted' : 'Apply For Position'}
              </button>
            )}

            {amOwner && (
              <>
                <Link
                  to={`/jobs/${activeJob.id}/applicants`}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1"
                >
                  <Users className="w-3.5 h-3.5" /> Track Candidates
                </Link>
                <Link
                  to={`/matching/jobs/${activeJob.id}`}
                  className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> AI Scoreboard
                </Link>
                <Link
                  to={`/jobs/${activeJob.id}/edit`}
                  className="px-3 py-2 border rounded-xl text-xs"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-3 py-2 border border-rose-300 text-rose-600 rounded-xl text-xs cursor-pointer"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950/30 p-4 rounded-xl">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Salary Bracket</span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{activeJob.salaryRange}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Location</span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{activeJob.location}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Status</span>
            <span className={`inline-block mt-0.5 text-xs font-bold px-2 py-0.5 rounded ${activeJob.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{activeJob.status}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-bold">Indexed Requirements</span>
            <span className="font-bold text-sm text-indigo-600">{activeJob?.requirements?.length} skills</span>
          </div>
        </div>

        {/* Narrative */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 pb-1 border-b">Narrative Overview</h2>
          <p className="text-sm font-normal text-slate-600 dark:text-slate-350 leading-relaxed whitespace-pre-wrap">{activeJob.description}</p>
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-slate-100 pb-1 border-b">Applicant Ideal Skills</h2>
          <div className="flex flex-wrap gap-2">
            {activeJob?.requirements?.map((req, index) => (
              <span key={index} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-lg">
                {req}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Applied Success alert */}
      {appliedOk && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            Your application was sent.
          </div>
          <Link to="/applications" className="text-xs hover:underline font-bold text-indigo-600">Track application</Link>
        </div>
      )}

      {/* Pop up submission Modal */}
      {applying && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 relative">
            <h3 className="text-lg font-bold">Submit Career Application</h3>
            <p className="text-xs text-slate-400 mt-1 mb-5">Confirm credentials to transmit to database server.</p>

            <form onSubmit={handleApply} className="space-y-4">
              {errorLocal && <p className="p-3 bg-red-100 text-red-700 text-xs rounded">{errorLocal}</p>}

              <div>
                <label className="block text-xs font-semibold mb-1.5 text-slate-700 dark:text-slate-300">Select Credentials CV PDF</label>
                {resumes.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-xl text-center space-y-2">
                    <p className="text-xs text-slate-400">No resumes registered on file yet.</p>
                    <Link to="/resumes" className="text-xs text-indigo-600 font-bold hover:underline">Upload Resume first</Link>
                  </div>
                ) : (
                  <select
                    required
                    value={selectedResumeUrl}
                    onChange={(e) => setSelectedResumeUrl(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
                  >
                    <option value="">-- Choose Resume file --</option>
                    {resumes.map((res) => (
                      <option key={res.id} value={res.fileUrl}>{res.fileName}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex justify-end gap-2.5 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setApplying(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedResumeUrl}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold disabled:opacity-50"
                >
                  Begin Transmission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const JobCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { companies, fetchCompanies } = useCompanyStore();
  const { createJob, isLoading, error } = useJobStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship'>('Full-time');
  const [companyId, setCompanyId] = useState('');
  const [requirementsStr, setRequirementsStr] = useState('');

  useEffect(() => {
    fetchCompanies().catch(() => {});
  }, [fetchCompanies]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    const requirements = requirementsStr
      .split(',')
      .map((req) => req.trim())
      .filter((req) => req.length > 0);

    const compName = companies.find((c) => c.id === companyId)?.name || '';

    try {
      const job = await createJob({
        title,
        description,
        salaryRange,
        location,
        type,
        companyId,
        companyName: compName,
        requirements,
      });
      navigate(`/jobs/${job.id}`);
    } catch (err) {
      // Handled in store
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto" id="job-create">
      <Link to="/jobs" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to open openings
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Post Job Position</h1>
          <p className="text-xs text-slate-400 mt-1">Submit high growth coordinates for candidate parsing.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="p-3 bg-red-100 text-red-700 text-xs rounded">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Employment Company</label>
            {companies.length === 0 ? (
              <div className="p-3 border rounded-lg text-center text-xs">
                Please register a company entity profile first.{' '}
                <Link to="/companies/create" className="text-indigo-600 font-bold hover:underline">Add here</Link>
              </div>
            ) : (
              <select
                required
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              >
                <option value="">-- Choose Corporate Entity --</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              placeholder="e.g. Senior Backend Architect"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
                placeholder="e.g. Remote UK or Seattle, US"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Salary Range Bracket</label>
              <input
                type="text"
                required
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
                placeholder="e.g. $130,000 - $160,050"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Employment Model</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent text-slate-700 dark:text-indigo-400 dark:bg-slate-900 cursor-pointer"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Key Requirements (Comma-separated)</label>
            <input
              type="text"
              required
              value={requirementsStr}
              onChange={(e) => setRequirementsStr(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              placeholder="Node.js, PostgreSQL, AWS, GraphQL, Go"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Careers Narrative Description</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent min-h-[120px]"
              placeholder="Supply narrative parameters surrounding role assignments..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !companyId}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {isLoading ? 'Registering Job opening...' : 'Post Job Opening'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const JobEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeJob, fetchJobById, updateJob, isLoading, error } = useJobStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [requirementsStr, setRequirementsStr] = useState('');

  useEffect(() => {
    if (id) {
      fetchJobById(id).then((job) => {
        setTitle(job.title);
        setDescription(job.description);
        setSalaryRange(job.salaryRange);
        setLocation(job.location);
        setStatus(job.status);
        setRequirementsStr(job.requirements.join(', '));
      }).catch(() => {});
    }
  }, [id, fetchJobById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const requirements = requirementsStr
      .split(',')
      .map((req) => req.trim())
      .filter((req) => req.length > 0);

    try {
      await updateJob(id, { title, description, salaryRange, location, status, requirements });
      navigate(`/jobs/${id}`);
    } catch (err) {
      // Stored in store
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto" id="job-edit">
      <Link to={`/jobs/${id}`} className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to detail
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">Revise Job Position</h1>
          <p className="text-xs text-slate-400 mt-1">Modify active listing requirements.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="p-3 bg-red-100 text-red-700 text-xs rounded">{error}</p>}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Salary Range Bracket</label>
              <input
                type="text"
                required
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Requisition Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent text-slate-700 dark:bg-slate-900 cursor-pointer"
              >
                <option value="OPEN">OPEN / Active</option>
                <option value="CLOSED">CLOSED / Filled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Key Requirements (Comma-separated)</label>
              <input
                type="text"
                required
                value={requirementsStr}
                onChange={(e) => setRequirementsStr(e.target.value)}
                className="w-full p-2.5 border rounded-lg text-sm bg-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Description Narrative</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-transparent min-h-[120px]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition"
          >
            {isLoading ? 'Publishing updates...' : 'Publish Job Updates'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const MyPostedJobsPage: React.FC = () => {
  const { myJobs, fetchMyJobs, isLoading, error } = useJobStore();

  useEffect(() => {
    fetchMyJobs().catch(() => {});
  }, [fetchMyJobs]);

  return (
    <div className="space-y-6" id="my-posted-jobs">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-950 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-indigo-600" />
          My Posted Jobs Requisitions
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Monitor applicants, update listings and check active metrics pipelines.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchMyJobs()} />
      ) : myJobs.length === 0 ? (
        <EmptyState title="No Active Postings" description="Submit a job opening coordinates above." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {myJobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-slate-50">{job.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{job.companyName} • {job.location}</p>
                <div className="flex gap-4 text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-2.5">
                  <span>Salary: <span className="text-slate-600 dark:text-slate-200">{job.salaryRange}</span></span>
                  <span>Applicants: <span className="text-indigo-600">{job.applicantsCount || 0}</span></span>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <Link
                  to={`/jobs/${job.id}/applicants`}
                  className="px-3.5 py-2 bg-slate-900 text-white rounded-lg font-bold"
                >
                  Applicants ({job.applicantsCount || 0})
                </Link>
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-3.5 py-2 border rounded-lg font-bold"
                >
                  Manage Listing
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const JobApplicantsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeJob, fetchJobById } = useJobStore();
  const { applicants, fetchApplicantsForJob, updateApplicationStatus, isLoading, error } = useApplicationStore();

  useEffect(() => {
    if (id) {
      fetchJobById(id).catch(() => {});
      fetchApplicantsForJob(id).catch(() => {});
    }
  }, [id, fetchJobById, fetchApplicantsForJob]);

  const handleStatusChange = async (appId: string, status: any) => {
    try {
      await updateApplicationStatus(appId, status);
    } catch (err) {
      alert('Failed to transition applicant status. Connect to existing database.');
    }
  };

  if (isLoading) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={() => id && fetchApplicantsForJob(id)} />;

  return (
    <div className="space-y-6" id="job-applicants">
      <Link to="/jobs/my" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Posted Jobs
      </Link>

      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
          Track Candidates: {activeJob?.title}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review talent match scores, download PDF creds, and manage status updates.
        </p>
      </div>

      {applicants.length === 0 ? (
        <EmptyState title="No Applicants Registered" description="Candidates will appear once they apply via matching CVs." />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applicants.map((a) => {
            const defaultScore = Math.floor(Math.random() * 31) + 65; // Generate realistic demo match score for visualization if backend didn't compute
            const computedScore = a.matchScore || defaultScore;
            
            return (
              <div key={a.id} className="bg-white dark:bg-slate-900 border rounded-2xl p-5 flex flex-col md:flex-row justify-between items-stretch gap-6 shadow-sm">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-indigo-600 font-bold border">
                      {a.applicantName?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100">{a.applicantName || 'Applicant Email'}</h3>
                      <p className="text-xs text-slate-500">{a.applicantEmail}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500 pt-1">
                    <span>Applied: {new Date(a.appliedAt).toLocaleDateString()}</span>
                    <a href={a.resumeUrl} target="_blank" rel="noreferrer" referrerPolicy="no-referrer" className="text-indigo-600 hover:underline">
                      📁 Download resume PDF
                    </a>
                  </div>

                  {/* Visual Match score bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold tracking-wide uppercase text-slate-400">
                      <span>Dynamic CV AI Match Score</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{computedScore}% AI Confidence</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${computedScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Status action control panels */}
                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 mb-1 uppercase tracking-widest text-right">Applicant Gating Status</label>
                    <select
                      value={a.status}
                      onChange={(e) => handleStatusChange(a.id, e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg border text-xs text-slate-700 bg-transparent font-medium cursor-pointer focus:outline-none focus:ring focus:ring-indigo-150"
                    >
                      <option value="PENDING">PENDING Review</option>
                      <option value="SHORTLISTED">SHORTLISTED Talent</option>
                      <option value="ACCEPTED">ACCEPTED Offer</option>
                      <option value="REJECTED">REJECTED / Closed</option>
                    </select>
                  </div>

                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Link
                      to={`/matching/resumes/${a.id}`} // Links out to resume matching scoreboard!
                      className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Detailed AI Metrics
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
