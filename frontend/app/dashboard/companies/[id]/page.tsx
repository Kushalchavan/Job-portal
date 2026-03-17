'use client';

import { useParams } from 'next/navigation';
import { mockCompanies, mockJobs } from '@/lib/data';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  MapPin,
  Globe,
  Briefcase,
  Plus,
  ArrowLeft,
} from 'lucide-react';

import Link from 'next/link';

export default function CompanyDetailsPage() {
  const params = useParams();
  const companyId = Number(params.id);

  const company = mockCompanies.find((c) => c.id === companyId);

  const companyJobs = mockJobs.filter((job) => job.company === company?.name);

  if (!company) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-semibold">Company not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}

        <div className="mb-8 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <Link href="/dashboard/companies">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 text-lg font-semibold text-accent">
                {/* {company.logo} */}
                {company?.name.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl font-bold">{company.name}</h1>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">

                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {company.location}
                  </span>

                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      className="flex items-center gap-1 hover:underline"
                    >
                      <Globe className="w-3 h-3" />
                      Website
                    </a>
                  )}
                </div>

              </div>

            </div>

          </div>

          <div className="flex gap-3">

            <Link href={`/dashboard/jobs/create?company=${company.id}`}>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Post Job
              </Button>
            </Link>

          </div>

        </div>

        {/* Company Description */}

        <Card className="p-6 mb-8 border border-border">
          <h3 className="font-semibold mb-2">About Company</h3>
          <p className="text-muted-foreground text-sm">
            {company.description || 'No company description provided.'}
          </p>
        </Card>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <Card className="p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-1">Active Jobs</p>
            <p className="text-3xl font-bold">{companyJobs.length}</p>
          </Card>

          <Card className="p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-1">Total Applications</p>
            <p className="text-3xl font-bold">
              {companyJobs.reduce((acc, job) => acc + (job.applications || 0), 0)}
            </p>
          </Card>

          <Card className="p-6 border border-border">
            <p className="text-muted-foreground text-sm mb-1">Open Positions</p>
            <p className="text-3xl font-bold">{companyJobs.length}</p>
          </Card>

        </div>

        {/* Jobs List */}

        <Card className="border border-border">

          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-lg">Jobs</h3>

            <Link href={`/dashboard/jobs/create?company=${company.id}`}>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>

          {companyJobs.length === 0 ? (

            <div className="p-10 text-center text-muted-foreground">
              No jobs posted yet.
            </div>

          ) : (

            <div className="divide-y">

              {companyJobs.map((job) => (

                <div
                  key={job.id}
                  className="flex items-center justify-between p-6 hover:bg-card/50 transition"
                >

                  <div>

                    <p className="font-medium text-foreground">
                      {job.title}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">

                      <Badge variant="outline">
                        {job.type}
                      </Badge>

                      <span>
                        {job.location}
                      </span>

                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {job.applications || 0} applicants
                    </span>

                    <Link href={`/dashboard/job/${job.id}`}>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </Card>

      </div>
    </div>
  );
}