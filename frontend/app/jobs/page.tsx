"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import JobCard from "@/components/job-card";
import ProtectedRoute from "@/components/protected-route";
import { getJobs } from "@/services/job.service";
import { Job } from "@/types/job.types";

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLevel = !selectedLevel || job.level === selectedLevel;
      const matchesType = !selectedType || job.employmentType === selectedType;
      const matchesLocation =
        !selectedLocation || job.location.includes(selectedLocation);

      return matchesSearch && matchesLevel && matchesType && matchesLocation;
    });
  }, [jobs, searchTerm, selectedLevel, selectedType, selectedLocation]);

  const levels = ["JUNIOR", "MID", "SENIOR", "LEAD"];
  const types = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"];
  const locations = ["Remote", "Work from Office", "Work from Home"];

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedLevel(null);
    setSelectedType(null);
    setSelectedLocation(null);
  };

  const hasActiveFilters =
    selectedLevel || selectedType || selectedLocation || searchTerm;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobs();
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="flex justify-center py-20">
  <p className="text-muted-foreground">Loading jobs...</p>
</div>
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Browse Jobs</h1>
            <p className="text-muted-foreground">
              Find opportunities that match your skills and interests
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border"
                  />
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full border-border"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                )}

                {/* Level Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">
                    Experience Level
                  </h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          setSelectedLevel(
                            selectedLevel === level ? null : level,
                          )
                        }
                        className={`block w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedLevel === level
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-card border border-transparent hover:border-border"
                        }`}
                      >
                        {level.charAt(0) + level.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">
                    Employment Type
                  </h3>
                  <div className="space-y-2">
                    {types.map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          setSelectedType(selectedType === type ? null : type)
                        }
                        className={`block w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedType === type
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-card border border-transparent hover:border-border"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Filter */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground text-sm">
                    Location
                  </h3>
                  <div className="space-y-2">
                    {locations.map((location) => (
                      <button
                        key={location}
                        onClick={() =>
                          setSelectedLocation(
                            selectedLocation === location ? null : location,
                          )
                        }
                        className={`block w-full text-left px-3 py-2 rounded-lg transition text-sm ${
                          selectedLocation === location
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground hover:bg-card border border-transparent hover:border-border"
                        }`}
                      >
                        {location}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {filteredJobs.length}
                  </span>{" "}
                  jobs
                </p>
                {hasActiveFilters && (
                  <div className="flex flex-wrap gap-2">
                    {searchTerm && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {searchTerm}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => setSearchTerm("")}
                        />
                      </Badge>
                    )}
                    {selectedLevel && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {selectedLevel}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => setSelectedLevel(null)}
                        />
                      </Badge>
                    )}
                    {selectedType && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {selectedType}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => setSelectedType(null)}
                        />
                      </Badge>
                    )}
                    {selectedLocation && (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80"
                      >
                        {selectedLocation}
                        <X
                          className="w-3 h-3 ml-1"
                          onClick={() => setSelectedLocation(null)}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Job Listings */}
              {filteredJobs.length > 0 ? (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    No jobs found matching your filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-border"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
