"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyJobs, type Job } from "@/data/jobs";

export function JobsList() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        } else {
          setJobs(dummyJobs);
        }
      } catch {
        setJobs(dummyJobs);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-lg border bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium text-gray-900">No jobs posted yet</p>
        <p className="mt-1 text-sm text-gray-500">
          Check back soon for new opportunities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => {
        const postedDate = new Date(job.created_at);
        const daysAgo = Math.floor(
          (Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return (
          <Card key={job.id}>
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold text-[#002E5D]">
                    {job.title}
                  </h3>
                  <p className="mt-0.5 font-medium text-gray-700">
                    {job.company}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {job.location}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {daysAgo === 0
                        ? "Today"
                        : daysAgo === 1
                        ? "1 day ago"
                        : `${daysAgo} days ago`}
                    </span>
                  </div>
                </div>
                <div className="shrink-0">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 items-center justify-center rounded-lg bg-[#002E5D] px-2.5 text-sm font-medium text-white transition-colors hover:bg-[#002E5D]/90"
                  >
                    Apply
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
