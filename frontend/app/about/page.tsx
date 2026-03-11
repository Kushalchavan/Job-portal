"use client";

import { Card } from "@/components/ui/card";
import { Users, Briefcase, Globe, Rocket } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background px-6 py-16">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-bold tracking-tight">
            About Hirely
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Hirely connects talented professionals with companies that are
            building the future. Our mission is to make job searching and
            hiring faster, simpler, and more transparent.
          </p>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border border-border hover:border-accent/50 transition">
            <div className="flex flex-col gap-3">
              <Users className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">For Job Seekers</h3>
              <p className="text-muted-foreground text-sm">
                Discover opportunities from top companies and track your
                applications in one place.
              </p>
            </div>
          </Card>

          <Card className="p-6 border border-border hover:border-accent/50 transition">
            <div className="flex flex-col gap-3">
              <Briefcase className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">For Recruiters</h3>
              <p className="text-muted-foreground text-sm">
                Post jobs, manage applicants, and hire the best talent faster.
              </p>
            </div>
          </Card>

          <Card className="p-6 border border-border hover:border-accent/50 transition">
            <div className="flex flex-col gap-3">
              <Rocket className="w-6 h-6 text-accent" />
              <h3 className="font-semibold text-lg">Our Mission</h3>
              <p className="text-muted-foreground text-sm">
                Build the most efficient platform where companies and talent
                connect seamlessly.
              </p>
            </div>
          </Card>
        </section>

        {/* Stats */}
        <section className="grid md:grid-cols-3 gap-6 text-center">
          <Card className="p-6 border border-border">
            <h3 className="text-3xl font-bold text-accent">10K+</h3>
            <p className="text-muted-foreground text-sm">
              Jobs Posted
            </p>
          </Card>

          <Card className="p-6 border border-border">
            <h3 className="text-3xl font-bold text-accent">5K+</h3>
            <p className="text-muted-foreground text-sm">
              Companies
            </p>
          </Card>

          <Card className="p-6 border border-border">
            <h3 className="text-3xl font-bold text-accent">50K+</h3>
            <p className="text-muted-foreground text-sm">
              Job Seekers
            </p>
          </Card>
        </section>

        {/* Vision */}
        <section className="text-center space-y-4">
          <Globe className="w-8 h-8 text-accent mx-auto" />
          <h2 className="text-2xl font-semibold">Our Vision</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            We believe hiring should be transparent, efficient, and global.
            Hirely aims to become the go-to platform for companies and
            professionals around the world.
          </p>
        </section>

      </div>
    </div>
  );
}