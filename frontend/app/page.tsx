import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Briefcase, TrendingUp, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative px-4 py-20 sm:py-32 md:py-40">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground text-balance">
              Find Your Next Opportunity
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Discover jobs tailored to your skills. Connect with top companies
              looking for talent like you.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Browse Jobs
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-border"
            >
              Get Started Free
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-border">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">
                12K+
              </div>
              <p className="text-sm text-muted-foreground">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">
                50K+
              </div>
              <p className="text-sm text-muted-foreground">Job Seekers</p>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-accent">
                500+
              </div>
              <p className="text-sm text-muted-foreground">Companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-24 border-t border-border bg-card/50">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Why Choose Hirely?
            </h2>
            <p className="text-muted-foreground">
              Everything you need to find the perfect job
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-6 border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Curated Opportunities
              </h3>
              <p className="text-muted-foreground text-sm">
                Handpicked jobs matching your skills and experience level.
              </p>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6 border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Top Companies
              </h3>
              <p className="text-muted-foreground text-sm">
                Work with industry leaders and innovative startups.
              </p>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6 border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                Career Growth
              </h3>
              <p className="text-muted-foreground text-sm">
                Advance your career with roles that match your ambitions.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Featured Jobs
            </h2>
            <Link href="/jobs">
              <Button
                variant="ghost"
                className="text-accent hover:text-accent hover:bg-accent/10"
              >
                View All
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="text-muted-foreground text-center py-12">
            Browse our job listings to see featured opportunities
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-24 bg-card border-t border-border">
        <div className="mx-auto max-w-3xl text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-muted-foreground">
            Join thousands of professionals who have found their perfect match
          </p>
          <Link href="/jobs">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Start Exploring
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/jobs" className="hover:text-accent transition">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/companies"
                    className="hover:text-accent transition"
                  >
                    Companies
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-accent transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-accent transition"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-accent transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-accent transition">
                    Help
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-accent transition"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-accent transition">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between text-muted-foreground text-sm">
            <p>&copy; 2026 Hirely. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition">
                Twitter
              </a>
              <a href="#" className="hover:text-accent transition">
                LinkedIn
              </a>
              <a href="#" className="hover:text-accent transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
