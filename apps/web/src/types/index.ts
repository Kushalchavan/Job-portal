/**
 * AI-Powered Recruitment Platform Types
 */

export type UserRole = 'USER' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  skills?: string[];
  resumeUrl?: string;
  isBlocked?: boolean;
}

export interface Company {
  id: string;
  name: string;
  description: string;
  website: string;
  location: string;
  logo?: string;
  recruiterId: string;
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  salaryRange: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' | 'Internship';
  status: 'OPEN' | 'CLOSED';
  companyId: string;
  companyName: string;
  companyLocation?: string;
  companyLogo?: string;
  recruiterId: string;
  createdAt: string;
  applicantsCount?: number;
  isSaved?: boolean;
  isApplied?: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle?: string;
  companyName?: string;
  userId: string;
  applicantName?: string;
  applicantEmail?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SHORTLISTED' | 'WITHDRAWN';
  resumeUrl: string;
  appliedAt: string;
  matchScore?: number;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface AIMatchingResult {
  jobId: string;
  resumeId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  summary: string;
  candidateName?: string;
  jobTitle?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: 'APPLICATION_STATUS_CHANGED' | 'NEW_APPLICANT' | 'SYSTEM' | 'JOB_MATCH';
  createdAt: string;
}

export interface SavedJob {
  id: string;
  userId: string;
  jobId: string;
  job?: Job;
  savedAt: string;
}

export interface DashboardStats {
  userStats?: {
    applicationsCount: number;
    savedJobsCount: number;
    resumesCount: number;
  };
  recruiterStats?: {
    companiesCount: number;
    jobsCount: number;
    applicationsCount: number;
    topCandidatesCount: number;
  };
  adminStats?: {
    usersCount: number;
    recruitersCount: number;
    jobsCount: number;
    applicationsCount: number;
  };
}

export interface HiringFunnelStage {
  stage: string;
  count: number;
}

export interface AnalyticsData {
  jobsCreatedOverTime: { date: string; count: number }[];
  applicationsOverTime: { date: string; count: number }[];
  hiringFunnel: HiringFunnelStage[];
}
