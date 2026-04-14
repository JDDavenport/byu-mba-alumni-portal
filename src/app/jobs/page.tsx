import type { Metadata } from "next";
import { JobsList } from "@/components/jobs-list";

export const metadata: Metadata = {
  title: "Jobs | BYU MBA Alumni Network",
  description:
    "Job opportunities posted by BYU MBA alumni and partner companies.",
};

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Board</h1>
        <p className="mt-2 text-gray-600">
          Opportunities shared by BYU MBA alumni and partner companies.
        </p>
      </div>
      <JobsList />
    </div>
  );
}
