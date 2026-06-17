import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
} from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import {
  CompaniesListPage,
  CompanyDetailPage,
  CompanyCreatePage,
  CompanyEditPage,
} from './pages/CompanyPages';
import {
  JobsListPage,
  JobDetailPage,
  JobCreatePage,
  JobEditPage,
  MyPostedJobsPage,
  JobApplicantsPage,
} from './pages/JobPages';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ResumesPage } from './pages/ResumesPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { NotificationPage } from './pages/NotificationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AdminUsersPage } from './pages/AdminPages';
import { JobMatchingPage, ResumeMatchingPage } from './pages/MatchingPages';
import { ProtectedLayout } from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public authentication routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes (All logged-in roles) */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/companies" element={<CompaniesListPage />} />
          <Route path="/companies/:id" element={<CompanyDetailPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
        </Route>

        {/* Protected USER specific routes */}
        <Route element={<ProtectedLayout allowedRoles={['USER']} />}>
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/saved-jobs" element={<SavedJobsPage />} />
        </Route>

        {/* Protected RECRUITER specific routes */}
        <Route element={<ProtectedLayout allowedRoles={['RECRUITER']} />}>
          <Route path="/companies/create" element={<CompanyCreatePage />} />
          <Route path="/companies/:id/edit" element={<CompanyEditPage />} />
          
          <Route path="/jobs/create" element={<JobCreatePage />} />
          <Route path="/jobs/my" element={<MyPostedJobsPage />} />
          <Route path="/jobs/:id/edit" element={<JobEditPage />} />
          <Route path="/jobs/:id/applicants" element={<JobApplicantsPage />} />
          
          <Route path="/matching/jobs/:jobId" element={<JobMatchingPage />} />
          <Route path="/matching/resumes/:resumeId" element={<ResumeMatchingPage />} />
          
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>

        {/* Protected ADMIN specific routes */}
        <Route element={<ProtectedLayout allowedRoles={['ADMIN']} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
        </Route>

        {/* Catch-all Routing Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
