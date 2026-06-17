import React, { useState, useEffect } from 'react';
import { useAuthStore, useResumeStore } from '../store';
import { LoadingSkeleton, ErrorState } from '../components/Common';
import { User, Sparkles, UserCircle2, Mail, BadgeHelp, CheckCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, error: authError, isLoading: authLoading, fetchCurrentUser } = useAuthStore();
  const { resumes, fetchResumes, uploadResume, deleteResume, isLoading: resumeLoading } = useResumeStore();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [skillsStr, setSkillsStr] = useState(user?.skills?.join(', ') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    fetchCurrentUser().catch(() => {});
    if (user?.role === 'USER') {
      fetchResumes().catch(() => {});
    }
  }, [fetchResumes, fetchCurrentUser]);

  // Handle syncing state when user object loads
  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setSkillsStr(user.skills?.join(', ') || '');
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(false);

    const skills = skillsStr
      .split(',')
      .map((sku) => sku.trim())
      .filter((sku) => sku.length > 0);

    try {
      await updateProfile({ name, bio, skills });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      // Handled by store error
    }
  };

  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadSuccess(false);
    const formData = new FormData();
    formData.append('resume', uploadFile);

    try {
      await uploadResume(formData);
      setUploadFile(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
      
      // Reset file input
      const fileInput = document.getElementById('resume-file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      // Error is caught and displayed by standard alert or local state
    }
  };

  return (
    <div className="space-y-8" id="profile-page">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <UserCircle2 className="w-7 h-7 text-indigo-600" />
          My Professional Profile
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Adjust your recruitment metadata, resume tags, and workspace details here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            Account Preferences
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {authError && (
              <p className="p-3 bg-red-100 text-red-700 text-xs font-semibold rounded-lg">
                {authError}
              </p>
            )}

            {saveSuccess && (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl text-xs text-emerald-800 dark:text-emerald-400 flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Profile metadata updated in database successfully!
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Address (Read-only)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full p-2.5 pl-10 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-500 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Professional Bio / Pitch
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-400/80 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-slate-900 dark:text-slate-100 min-h-[100px]"
                placeholder="Give recruiters a brief pitch about your career goals, experience, or what makes you unique..."
              />
            </div>

            {user?.role === 'USER' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Skills (Comma-separated listed tags)
                </label>
                <input
                  type="text"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-slate-900 dark:text-slate-50"
                  placeholder="React, TypeScript, Node.js, Next.js, Redux, PostgreSQL"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Skills are indexed inside the AI parser engine to score matching jobs correctly.
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-md cursor-pointer transition"
            >
              {authLoading ? 'Synchronizing with backend...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Credentials Side rail */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-50 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              RecruitAI Identity
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg">
                <span className="text-slate-500">Security Access Role</span>
                <span className="font-bold text-indigo-600">{user?.role}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg">
                <span className="text-slate-500">Handshake Profile ID</span>
                <span className="font-mono text-[9px] text-slate-600 dark:text-slate-400">{user?.id}</span>
              </div>
            </div>
          </div>

          {/* User Resume upload module */}
          {user?.role === 'USER' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-50">Upload Digital Resume</h3>

              <form onSubmit={handleResumeUpload} className="space-y-4">
                {uploadSuccess && (
                  <p className="p-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">
                    Resume uploaded successfully!
                  </p>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Select Credentials file (PDF)
                  </label>
                  <input
                    id="resume-file-input"
                    type="file"
                    accept=".pdf"
                    required
                    onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resumeLoading || !uploadFile}
                  className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition disabled:opacity-50 cursor-pointer"
                >
                  {resumeLoading ? 'Uploading credentials...' : 'Begin Upload & Parse'}
                </button>
              </form>

              {/* Uploaded Resumes list */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Your Uploaded Files</h4>
                {resumes.length === 0 ? (
                  <p className="text-xs text-slate-400">No resumes registered on file yet.</p>
                ) : (
                  <div className="space-y-2">
                    {resumes.map((res) => (
                      <div key={res.id} className="flex justify-between items-center text-xs p-2 bg-slate-50 dark:bg-slate-950 rounded-lg">
                        <span className="font-medium truncate max-w-[140px] text-slate-900 dark:text-slate-100" title={res.fileName}>
                          {res.fileName}
                        </span>
                        <div className="flex gap-2">
                          <a
                            href={res.fileUrl}
                            target="_blank"
                            referrerPolicy="no-referrer"
                            rel="noreferrer"
                            className="text-[10px] text-indigo-600 hover:underline font-bold"
                          >
                            PDF
                          </a>
                          <button
                            onClick={() => deleteResume(res.id)}
                            className="text-[10px] text-rose-500 hover:underline font-bold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
