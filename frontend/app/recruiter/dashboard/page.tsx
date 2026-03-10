'use client';

import { StatsCard } from '@/components/stats-card';
import { recentApplicants } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Users,
  FileText,
  TrendingUp,
  Star,
  Mail,
  MoreVertical,
} from 'lucide-react';

const statusColors: Record<string, string> = {
  New: 'badge-pending',
  Reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  Interview: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
  Offer: 'badge-success',
  Rejected: 'badge-rejected',
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Recruiter Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your job postings and track applicants
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Active Jobs"
              value="12"
              icon={Briefcase}
              change="2"
              changeType="positive"
            />
            <StatsCard
              label="Total Applicants"
              value="285"
              icon={Users}
              change="45"
              changeType="positive"
            />
            <StatsCard
              label="Pending Reviews"
              value="23"
              icon={FileText}
              change="8"
              changeType="negative"
            />
            <StatsCard
              label="Offers Sent"
              value="8"
              icon={TrendingUp}
              change="2"
              changeType="positive"
            />
          </div>
        </div>
      </section>

      {/* Recent Applicants Section */}
      <section className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Recent Applicants</h2>
              <p className="mt-1 text-muted-foreground">
                Latest job applications from candidates
              </p>
            </div>
            <Button variant="outline">View All</Button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Position
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentApplicants.map((applicant, idx) => (
                  <tr
                    key={applicant.id}
                    className={`border-b border-border ${idx % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'
                      } hover:bg-muted/40 transition-colors`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {applicant.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {applicant.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {applicant.position}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(applicant.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`badge ${statusColors[applicant.status]}`}>
                        {applicant.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < applicant.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-muted-foreground'
                            }
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="Send email">
                          <Mail size={16} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="border-t border-border px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button size="lg" className="h-auto flex-col items-start justify-start p-6 text-left bg-primary hover:bg-primary/90">
              <Briefcase className="mb-2 h-6 w-6" />
              <span className="font-semibold">Post a Job</span>
              <span className="text-sm opacity-90">Create a new job listing</span>
            </Button>
            <Button variant="outline" size="lg" className="h-auto flex-col items-start justify-start p-6 text-left">
              <Users className="mb-2 h-6 w-6" />
              <span className="font-semibold">View All Applicants</span>
              <span className="text-sm">Manage all candidates</span>
            </Button>
            <Button variant="outline" size="lg" className="h-auto flex-col items-start justify-start p-6 text-left">
              <FileText className="mb-2 h-6 w-6" />
              <span className="font-semibold">Download Reports</span>
              <span className="text-sm">Export recruitment metrics</span>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
