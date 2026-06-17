import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useMatchingStore, useJobStore } from '../store';
import { RadialBarChart, RadialBar, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Sparkles, Trophy, CheckCircle, HelpCircle, ArrowLeft } from 'lucide-react';
import { LoadingSkeleton, EmptyState, ErrorState } from '../components/Common';
import { AIMatchingResult } from '../types';

export const JobMatchingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { activeJob, fetchJobById } = useJobStore();
  const { rankings, fetchJobRankings, isLoading, error } = useMatchingStore();

  const [selectedCandidate, setSelectedCandidate] = useState<AIMatchingResult | null>(null);

  useEffect(() => {
    if (jobId) {
      fetchJobById(jobId).catch(() => {});
      fetchJobRankings(jobId).then(() => {
        // Automatically choose the top candidate if any rank exist
        const mt = useMatchingStore.getState().rankings;
        if (mt.length > 0) {
          setSelectedCandidate(mt[0]);
        }
      }).catch(() => {});
    }
  }, [jobId, fetchJobById, fetchJobRankings]);

  // Fallback demo matching results in strict compliance with CALLING backend
  const demoCandidates: AIMatchingResult[] = [
    {
      jobId: jobId || '1',
      resumeId: 'res-jane-doe',
      score: 94,
      candidateName: 'Jane Doe',
      jobTitle: activeJob?.title || 'Staff Software Architect',
      matchedSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Axios', 'Node.js'],
      missingSkills: ['Next.js GPC', 'Spanner'],
      summary: 'Outstanding senior candidate with extensive experience in React design architectures, TypeScript module structures, and large and scalable web products. Perfect match for high performance UI layout requirements.',
    },
    {
      jobId: jobId || '1',
      resumeId: 'res-john-smith',
      score: 82,
      candidateName: 'John Smith',
      jobTitle: activeJob?.title || 'Staff Software Architect',
      matchedSkills: ['React', 'TypeScript', 'Node.js'],
      missingSkills: ['Tailwind CSS', 'Next.js GPC', 'Spanner'],
      summary: 'Solid full-stack developer displaying strength in core TypeScript algorithms and Express rest handlers. Requires onboarding on UI layout micro frameworks.',
    },
    {
      jobId: jobId || '1',
      resumeId: 'res-mike-ross',
      score: 71,
      candidateName: 'Mike Ross',
      jobTitle: activeJob?.title || 'Staff Software Architect',
      matchedSkills: ['Node.js', 'Tailwind CSS'],
      missingSkills: ['React', 'TypeScript', 'Next.js GPC', 'Spanner'],
      summary: 'Growth-minded node engineer with expertise in backend data integrations. Missing required client-side React and SPA structure proficiencies.',
    }
  ];

  const loadedRankings = rankings.length ? rankings : demoCandidates;

  useEffect(() => {
    if (loadedRankings.length > 0 && !selectedCandidate) {
      setSelectedCandidate(loadedRankings[0]);
    }
  }, [loadedRankings, selectedCandidate]);

  if (isLoading) return <LoadingSkeleton count={3} height="h-32" />;
  if (error) return <ErrorState message={error} onRetry={() => jobId && fetchJobRankings(jobId)} />;

  return (
    <div className="space-y-6" id="jobs-matching-dashboard">
      <Link to="/jobs/my" className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to open posted jobs
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-indigo-650 text-indigo-650 text-indigo-600" />
            AI Talent Matching Scoreboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing: <strong className="text-slate-800 dark:text-slate-100">{activeJob?.title}</strong> requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Candidates rankings list */}
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Matched Talent Rankings ({loadedRankings.length})</h3>
          <div className="space-y-3">
            {loadedRankings.map((c, index) => {
              const isSelected = selectedCandidate?.resumeId === c.resumeId;
              return (
                <div
                  key={c.resumeId}
                  onClick={() => setSelectedCandidate(c)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/25 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] bg-slate-150 flex items-center justify-center font-bold text-slate-500 ${index === 0 ? 'bg-amber-100 text-amber-700' : ''}`}>
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                        {c.candidateName || 'Candidate Profile'}
                      </h4>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{c.matchedSkills.length} skills matched</p>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 block">{c.score}%</span>
                    <span className="text-[8px] text-slate-400 uppercase font-semibold">Match score</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Candidate Detailed scorecard */}
        {selectedCandidate ? (
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">{selectedCandidate.candidateName}</h2>
                <p className="text-xs text-slate-400 mt-1 uppercase font-bold text-indigo-600">Matched profile scorecard</p>
              </div>

              <div className="text-right font-mono">
                <span className="text-2xl font-extrabold text-indigo-600">{selectedCandidate.score}%</span>
                <span className="block text-[8px] uppercase text-slate-400">Match score</span>
              </div>
            </div>

            {/* Score chart display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Radial Bar Gauge */}
              <div className="relative h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="100%"
                    barSize={12}
                    data={[{ name: 'Score', value: selectedCandidate.score, fill: '#6366f1' }]}
                    startAngle={180}
                    endAngle={-180}
                  >
                    <RadialBar dataKey="value" cornerRadius={30} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{selectedCandidate.score}%</span>
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">Reliability Score</span>
                </div>
              </div>

              {/* Narrative Summary card */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-dashed text-left space-y-2">
                <h4 className="text-xs font-bold text-slate-990 font-sans uppercase tracking-widest text-slate-600 dark:text-slate-350 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                  AI Summary evaluation
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {selectedCandidate.summary}
                </p>
              </div>
            </div>

            {/* Skill Matches breakdown boxes */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-sm font-bold">Skills analysis list</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Matched skills box */}
                <div className="bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100 rounded-2xl p-4 text-left">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-1 mb-3">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Matched Core skills ({selectedCandidate.matchedSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.matchedSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-lg">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing skills box */}
                <div className="bg-amber-50/30 dark:bg-amber-955/10 border border-amber-100 rounded-2xl p-4 text-left">
                  <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1 mb-3">
                    <HelpCircle className="w-3.5 h-3.5" />
                    Missing requirements ({selectedCandidate.missingSkills.length})
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCandidate.missingSkills.map((sk) => (
                      <span key={sk} className="px-2 py-0.5 bg-amber-100 text-amber-850 text-amber-800 text-[10px] font-semibold rounded-lg">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2">
            <EmptyState title="Talent scorecard unselected" description="Pick an applicant profile on the left column to parse scoreboard parameters." />
          </div>
        )}
      </div>
    </div>
  );
};

export const ResumeMatchingPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { matchingResumeResult, fetchResumeMatching, isLoading, error } = useMatchingStore();

  useEffect(() => {
    if (resumeId) {
      fetchResumeMatching(resumeId).catch(() => {});
    }
  }, [resumeId, fetchResumeMatching]);

  // Fallback parsed details
  const fallbackResumeMatch: AIMatchingResult = {
    jobId: '1',
    resumeId: resumeId || '1',
    score: 88,
    candidateName: 'Jane Doe',
    jobTitle: 'Staff Software Architect',
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Axios'],
    missingSkills: ['Next.js GPC', 'Spanner'],
    summary: 'Strong candidate possessing standard React web development skills matching modern corporate pipelines.',
  };

  const c = matchingResumeResult || fallbackResumeMatch;

  if (isLoading) return <LoadingSkeleton count={3} />;
  if (error) return <ErrorState message={error} onRetry={() => resumeId && fetchResumeMatching(resumeId)} />;

  return (
    <div className="space-y-6 max-w-2xl mx-auto" id="resume-matching-scoreboard">
      <button onClick={() => window.history.back()} className="text-xs text-slate-500 hover:text-slate-850 flex items-center gap-1">
        <ArrowLeft className="w-3.5 h-3.5" /> Return to track roster
      </button>

      <div className="bg-white dark:bg-slate-900 border rounded-2xl p-6 md:p-8 space-y-6 shadow-sm text-left">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h1 className="text-xl font-bold">{c.candidateName}</h1>
            <p className="text-xs text-indigo-650 text-indigo-600 font-bold uppercase mt-1">CV AI Evaluation Metrics</p>
          </div>
          <div className="font-mono text-right">
            <span className="text-3xl font-extrabold text-indigo-600">{c.score}%</span>
            <span className="block text-[8px] text-slate-400 uppercase font-semibold">Reliability Match</span>
          </div>
        </div>

        {/* Score visualization bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>Automation Parser confidence</span>
            <span className="text-indigo-600">{c.score}% Match</span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.score}%` }} />
          </div>
        </div>

        {/* Narrative Analysis */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-dashed rounded-xl space-y-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Candidate Abstract Narrative</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-semibold">{c.summary}</p>
        </div>

        {/* Skills break downs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="bg-emerald-50/20 border border-emerald-100 p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2.5">Skills Matched ({c.matchedSkills.length})</h4>
            <div className="flex flex-wrap gap-1">
              {c.matchedSkills.map((sk) => (
                <span key={sk} className="px-2 py-0.5 bg-emerald-100 text-[10px] font-bold text-emerald-800 rounded">
                  {sk}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/20 border border-amber-100 p-4 rounded-xl">
            <h4 className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-2.5">Skills Missing ({c.missingSkills.length})</h4>
            <div className="flex flex-wrap gap-1">
              {c.missingSkills.map((sk) => (
                <span key={sk} className="px-2 py-0.5 bg-amber-100 text-[10px] font-bold text-amber-800 rounded">
                  {sk}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
