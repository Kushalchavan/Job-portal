'use client';

import { mockJobs, mockApplications, mockUsers } from '@/lib/data';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, Briefcase, CheckCircle2, Clock, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/protected-route';

// Mock data for charts
const chartData = [
  { month: 'Jan', applications: 120, hired: 12 },
  { month: 'Feb', applications: 150, hired: 18 },
  { month: 'Mar', applications: 180, hired: 24 },
  { month: 'Apr', applications: 165, hired: 20 },
  { month: 'May', applications: 200, hired: 28 },
  { month: 'Jun', applications: 220, hired: 35 },
];

export default function DashboardPage() {
  const totalApplications = mockApplications.length;
  const reviewingApplications = mockApplications.filter(a => a.status === 'reviewing').length;
  const acceptedApplications = mockApplications.filter(a => a.status === 'accepted').length;

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Recruiter Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, Jane Smith</p>
          </div>
          <Link href="/jobs/new">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Total Applications */}
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-foreground">{totalApplications}</p>
                <p className="text-xs text-accent mt-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          {/* Active Jobs */}
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-foreground">{mockJobs.length}</p>
                <p className="text-xs text-muted-foreground mt-2">6 posted this month</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
            </div>
          </Card>

          {/* In Review */}
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">In Review</p>
                <p className="text-3xl font-bold text-foreground">{reviewingApplications}</p>
                <p className="text-xs text-muted-foreground mt-2">Waiting for decision</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          {/* Hired */}
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Hired This Year</p>
                <p className="text-3xl font-bold text-foreground">{acceptedApplications}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Successful hires
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Applications Trend */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Applications Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="var(--accent)"
                  dot={{ fill: 'var(--accent)' }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Hiring Funnel */}
          <Card className="p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4">Hiring Funnel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Bar dataKey="hired" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold text-foreground text-lg">Recent Applications</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card/50">
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Job</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Candidate</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Applied</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockApplications.slice(0, 5).map((application) => {
                  const job = mockJobs.find(j => j.id === application.jobId);
                  const user = mockUsers.find(u => u.id === application.userId);
                  
                  const statusColors: Record<string, string> = {
                    applied: 'bg-blue-500/10 text-blue-600',
                    reviewing: 'bg-yellow-500/10 text-yellow-600',
                    interviewed: 'bg-purple-500/10 text-purple-600',
                    accepted: 'bg-green-500/10 text-green-600',
                    rejected: 'bg-red-500/10 text-red-600',
                  };

                  return (
                    <tr key={application.id} className="border-b border-border hover:bg-card/50 transition">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{job?.title}</p>
                        <p className="text-sm text-muted-foreground">{job?.company}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{user?.name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {application.appliedDate.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={`${statusColors[application.status] || 'bg-gray-500/10 text-gray-600'}`}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border p-4 text-center">
            <Link href="/dashboard/applications">
              <Button variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">
                View all applications
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
