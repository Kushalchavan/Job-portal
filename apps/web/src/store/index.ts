import { create } from 'zustand';
import { api, API_STORAGE_KEYS } from '../services/api';
import {
  User,
  Company,
  Job,
  Application,
  Resume,
  AIMatchingResult,
  Notification,
  AnalyticsData,
  UserRole,
  DashboardStats,
} from '../types';

// ========================
// 1. AUTH STORE
// ========================
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<User | null>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    if (get().isInitialized) return;
    const token = localStorage.getItem(API_STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      set({ isInitialized: true });
      return;
    }
    try {
      set({ isLoading: true });
      const res = await api.get('/auth/me');
      set({ user: res.data.user || res.data, isAuthenticated: true, error: null });
    } catch (err: any) {
      localStorage.removeItem(API_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(API_STORAGE_KEYS.REFRESH_TOKEN);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });

      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem(API_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(API_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      set({ user, isAuthenticated: true, error: null });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Login failed';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', { name, email, password, role });

      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem(API_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        localStorage.setItem(API_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      }
      set({ user, isAuthenticated: true, error: null });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Registration failed';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem(API_STORAGE_KEYS.REFRESH_TOKEN);
      await api.post('/auth/logout', { refreshToken }).catch(() => {});
    } finally {
      localStorage.removeItem(API_STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(API_STORAGE_KEYS.REFRESH_TOKEN);
      set({ user: null, isAuthenticated: false, error: null });
    }
  },

  fetchCurrentUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/auth/me');
      const user = res.data.data;
      set({ user, isAuthenticated: true, error: null });
      return user;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to fetch current user';
      set({ error: errMsg });
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put('/auth/profile', data);
      const user = res.data.data;
      set({ user, error: null });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to update profile';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Setup listener for unauthorized event
if (typeof window !== 'undefined') {
  window.addEventListener('auth:unauthorized', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false });
  });
}

// ========================
// 2. COMPANY STORE
// ========================
interface CompanyState {
  companies: Company[];
  activeCompany: Company | null;
  isLoading: boolean;
  error: string | null;
  fetchCompanies: () => Promise<void>;
  fetchCompanyById: (id: string) => Promise<Company>;
  createCompany: (data: Omit<Company, 'id' | 'createdAt' | 'recruiterId'>) => Promise<Company>;
  updateCompany: (id: string, data: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companies: [],
  activeCompany: null,
  isLoading: false,
  error: null,

  fetchCompanies: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/companies/my');
      set({ companies: Array.isArray(res.data) ? res.data : res.data.companies || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch companies' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCompanyById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/companies/${id}`);
      const company = res.data.company || res.data;
      set({ activeCompany: company });
      return company;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to fetch company';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createCompany: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/companies', data);
      const newCompany = res.data.company || res.data;
      set((state) => ({ companies: [...state.companies, newCompany] }));
      return newCompany;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to create company';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCompany: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/companies/${id}`, data);
      const updated = res.data.company || res.data;
      set((state) => ({
        companies: state.companies.map((c) => (c.id === id ? updated : c)),
        activeCompany: state.activeCompany?.id === id ? updated : state.activeCompany,
      }));
      return updated;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update company';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCompany: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/companies/${id}`);
      set((state) => ({
        companies: state.companies.filter((c) => c.id !== id),
        activeCompany: state.activeCompany?.id === id ? null : state.activeCompany,
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to delete company';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 3. JOB STORE
// ========================
interface JobFilters {
  search?: string;
  location?: string;
  type?: string;
  page?: number;
  limit?: number;
}

interface JobState {
  jobs: Job[];
  myJobs: Job[];
  activeJob: Job | null;
  isLoading: boolean;
  error: string | null;
  totalJobs: number;
  currentPage: number;
  totalPages: number;
  fetchJobs: (filters?: JobFilters) => Promise<void>;
  fetchJobById: (id: string) => Promise<Job>;
  createJob: (data: Omit<Job, 'id' | 'createdAt' | 'recruiterId' | 'status'>) => Promise<Job>;
  updateJob: (id: string, data: Partial<Job>) => Promise<Job>;
  deleteJob: (id: string) => Promise<void>;
  fetchMyJobs: () => Promise<void>;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  myJobs: [],
  activeJob: null,
  isLoading: false,
  error: null,
  totalJobs: 0,
  currentPage: 1,
  totalPages: 1,

  fetchJobs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/jobs', { params: filters });
      const data = res.data;
      if (Array.isArray(data)) {
        set({ jobs: data, totalJobs: data.length, currentPage: 1, totalPages: 1 });
      } else {
        set({
          jobs: data.jobs || [],
          totalJobs: data.total || data.totalJobs || 0,
          currentPage: data.page || data.currentPage || 1,
          totalPages: data.pages || data.totalPages || 1,
        });
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch jobs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      // In compliance, fetch authenticated recruiter's jobs
      const res = await api.get('/jobs/my');
      set({ myJobs: Array.isArray(res.data) ? res.data : res.data.jobs || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch my jobs' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchJobById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/jobs/${id}`);
      const job = res.data.job || res.data;
      set({ activeJob: job });
      return job;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to fetch job description';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  createJob: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/jobs', data);
      const newJob = res.data.job || res.data;
      set((state) => ({ jobs: [newJob, ...state.jobs], myJobs: [newJob, ...state.myJobs] }));
      return newJob;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to create job';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  updateJob: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/jobs/${id}`, data);
      const updated = res.data.job || res.data;
      set((state) => ({
        jobs: state.jobs.map((j) => (j.id === id ? updated : j)),
        myJobs: state.myJobs.map((j) => (j.id === id ? updated : j)),
        activeJob: state.activeJob?.id === id ? updated : state.activeJob,
      }));
      return updated;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update job';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteJob: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((j) => j.id !== id),
        myJobs: state.myJobs.filter((j) => j.id !== id),
        activeJob: state.activeJob?.id === id ? null : state.activeJob,
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to delete job';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 4. APPLICATION STORE
// ========================
interface ApplicationState {
  applications: Application[];
  applicants: Application[];
  isLoading: boolean;
  error: string | null;
  applyForJob: (jobId: string, resumeUrl: string) => Promise<Application>;
  fetchMyApplications: () => Promise<void>;
  withdrawApplication: (id: string) => Promise<void>;
  fetchApplicantsForJob: (jobId: string) => Promise<void>;
  updateApplicationStatus: (
    id: string,
    status: Application['status']
  ) => Promise<Application>;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  applicants: [],
  isLoading: false,
  error: null,

  applyForJob: async (jobId, resumeUrl) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/applications', { jobId, resumeUrl });
      const newApp = res.data.application || res.data;
      set((state) => ({ applications: [newApp, ...state.applications] }));
      return newApp;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to submit application';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyApplications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/applications/me');
      set({ applications: Array.isArray(res.data) ? res.data : res.data.applications || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch my applications' });
    } finally {
      set({ isLoading: false });
    }
  },

  withdrawApplication: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/applications/${id}`); // Or PUT withdraw endpoints
      set((state) => ({
        applications: state.applications.filter((a) => a.id !== id),
      }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to withdraw application';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchApplicantsForJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/jobs/${jobId}/applicants`);
      set({ applicants: Array.isArray(res.data) ? res.data : res.data.applicants || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch applicants' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateApplicationStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.put(`/applications/${id}/status`, { status });
      const updated = res.data.application || res.data;
      set((state) => ({
        applicants: state.applicants.map((a) => (a.id === id ? { ...a, status } : a)),
        applications: state.applications.map((a) => (a.id === id ? { ...a, status } : a)),
      }));
      return updated;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to update application status';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 5. RESUME STORE
// ========================
interface ResumeState {
  resumes: Resume[];
  isLoading: boolean;
  error: string | null;
  fetchResumes: () => Promise<void>;
  uploadResume: (fd: FormData) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set) => ({
  resumes: [],
  isLoading: false,
  error: null,

  fetchResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/resumes/me');
      set({ resumes: Array.isArray(res.data) ? res.data : res.data.resumes || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch resumes' });
    } finally {
      set({ isLoading: false });
    }
  },

  uploadResume: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newResume = res.data.resume || res.data;
      set((state) => ({ resumes: [newResume, ...state.resumes] }));
      return newResume;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to upload resume';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/resumes/${id}`);
      set((state) => ({ resumes: state.resumes.filter((r) => r.id !== id) }));
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to delete resume';
      set({ error: errMsg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 6. SAVED JOBS STORE
// ========================
interface SavedJobsState {
  savedJobs: Job[];
  isLoading: boolean;
  error: string | null;
  fetchSavedJobs: () => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
}

export const useSavedJobsStore = create<SavedJobsState>((set) => ({
  savedJobs: [],
  isLoading: false,
  error: null,

  fetchSavedJobs: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/saved-jobs');
      set({ savedJobs: Array.isArray(res.data) ? res.data : res.data.savedJobs || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch saved jobs' });
    } finally {
      set({ isLoading: false });
    }
  },

  saveJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      await api.post(`/saved-jobs/${jobId}`);
      // Reload is simplest to synchronize counts, but let's push locally as well if jobs find
      const jobStore = useJobStore.getState();
      const jobObj = jobStore.jobs.find((j) => j.id === jobId);
      if (jobObj) {
        set((state) => ({
          savedJobs: state.savedJobs.some((j) => j.id === jobId)
            ? state.savedJobs
            : [...state.savedJobs, { ...jobObj, isSaved: true }],
        }));
      }
      // Update isSaved in jobStore
      jobStore.fetchJobs();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to save job' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  unsaveJob: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/saved-jobs/${jobId}`);
      set((state) => ({ savedJobs: state.savedJobs.filter((j) => j.id !== jobId) }));
      const jobStore = useJobStore.getState();
      jobStore.fetchJobs();
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to unsave job' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 7. NOTIFICATION STORE
// ========================
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/notifications');
      const data = Array.isArray(res.data) ? res.data : res.data.notifications || [];
      set({
        notifications: data,
        unreadCount: data.filter((n: Notification) => !n.isRead).length,
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch notifications' });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.isRead).length,
        };
      });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: async () => {
    console.warn("Mark read-all as read not implemented")
  },
}));

// ========================
// 8. AI MATCHING STORE
// ========================
interface MatchingState {
  matchingJobResult: AIMatchingResult | null;
  matchingResumeResult: AIMatchingResult | null;
  rankings: AIMatchingResult[];
  isLoading: boolean;
  error: string | null;
  fetchJobMatching: (jobId: string) => Promise<void>;
  fetchResumeMatching: (resumeId: string) => Promise<void>;
  fetchJobRankings: (jobId: string) => Promise<void>;
}

export const useMatchingStore = create<MatchingState>((set) => ({
  matchingJobResult: null,
  matchingResumeResult: null,
  rankings: [],
  isLoading: false,
  error: null,

  fetchJobMatching: async (jobId) => {
    set({ isLoading: true, error: null, matchingJobResult: null });
    try {
      const res = await api.get(`/matching/${jobId}/matches`);
      set({ matchingJobResult: res.data.matching || res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch job matchmaking metrics' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResumeMatching: async (resumeId) => {
    set({ isLoading: true, error: null, matchingResumeResult: null });
    try {
      const res = await api.get(`/matching/resumes/${resumeId}`);
      set({ matchingResumeResult: res.data.matching || res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch resume matches' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchJobRankings: async (jobId) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/matching/${jobId}/top-candidates`);
      set({ rankings: Array.isArray(res.data) ? res.data : res.data.rankings || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch matching candidate rankings' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 9. ANALYTICS & DASHBOARD STORE
// ========================
interface AnalyticsState {
  analytics: AnalyticsData | null;
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: () => Promise<void>;
  fetchDashboardStats: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  analytics: null,
  stats: null,
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/analytics');
      set({ analytics: res.data.analytics || res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch analytics metrics' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDashboardStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/analytics');
      set({ stats: res.data.stats || res.data });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch dashboard stats' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// ========================
// 10. ADMIN STORE
// ========================
interface AdminState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  blockUser: (id: string) => Promise<void>;
  unblockUser: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get('/admin/users');
      set({ users: Array.isArray(res.data) ? res.data : res.data.users || [] });
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to fetch platform users list' });
    } finally {
      set({ isLoading: false });
    }
  },

  blockUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/admin/users/${id}/block`);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, isBlocked: true } : u)),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to block user' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  unblockUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.patch(`/admin/users/${id}/unblock`);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, isBlocked: false } : u)),
      }));
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Failed to unblock user' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },
}));
