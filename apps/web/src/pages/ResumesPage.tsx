import React, { useEffect, useState } from 'react';
import { useResumeStore, useAuthStore } from '../store';
import { FileHeart, UploadCloud, Trash, Check, CheckCircle2, ShieldAlert } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';

export const ResumesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { resumes, fetchResumes, uploadResume, deleteResume, isLoading, error } = useResumeStore();

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchResumes().catch(() => {});
    }
  }, [fetchResumes, user]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setSuccess(false);
    const formData = new FormData();
    formData.append('resume', uploadFile);

    try {
      await uploadResume(formData);
      setUploadFile(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      const fileInput = document.getElementById('res-upload-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch {
      // Caught in store
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(id);
      } catch {
        alert('Resume deleted.');
      }
    }
  };

  return (
    <div className="space-y-6" id="resumes-upload-dashboard">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
          <FileHeart className="w-7 h-7 text-indigo-650 text-indigo-650 text-indigo-600" />
          My Credentials Resumes on File
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Provide your target qualifications PDF. They are automatically indexed by the AI skills matching core.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Upload area */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
          <h3 className="font-extrabold text-slate-900 dark:text-slate-50 text-base">Upload Credentials (PDF format)</h3>
          
          <form onSubmit={handleUpload} className="space-y-4">
            {success && (
              <div className="p-3.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Credentials uploaded successfully!
              </div>
            )}

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center cursor-pointer hover:bg-slate-50 hover:border-slate-350 dark:hover:bg-slate-950/20 transition flex flex-col items-center justify-center relative">
              <UploadCloud className="w-10 h-10 text-slate-400 mb-3" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Choose File</span>
              <span className="text-[10px] text-slate-400 mt-1">Accept .pdf formats only</span>
              
              <input
                id="res-upload-file"
                type="file"
                required
                accept=".pdf"
                onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </div>

            {uploadFile && (
              <p className="text-xs text-indigo-600 font-semibold bg-indigo-50/50 p-2 rounded-xl border border-indigo-150">
                Selected: {uploadFile.name} ({(uploadFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !uploadFile}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 transition cursor-pointer"
            >
              {isLoading ? 'Uploading...' : 'Transmit Credentials'}
            </button>
          </form>
        </div>

        {/* Right: Listed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Active Credentials ({resumes.length})</h3>

          {isLoading && resumes.length === 0 ? (
            <LoadingSkeleton count={2} height="h-16" />
          ) : error ? (
            <ErrorState message={error} onRetry={() => fetchResumes()} />
          ) : resumes.length === 0 ? (
            <EmptyState title="No Credentials Registered" description="Your uploaded files will appear here." />
          ) : (
            <div className="space-y-3">
              {resumes.map((res) => (
                <div key={res.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border font-bold">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate max-w-sm" title={res.fileName}>
                        {res.fileName}
                      </h4>
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Uploaded {new Date(res.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      referrerPolicy="no-referrer"
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 rounded-lg text-xs font-semibold text-indigo-600"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(res.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer"
                      title="Delete Resume"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
