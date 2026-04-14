import type { Metadata } from "next";
import { DirectoryFilters } from "@/components/directory-filters";

export const metadata: Metadata = {
  title: "Alumni Directory | BYU MBA Alumni Network",
  description:
    "Search and filter the BYU MBA alumni directory by name, industry, company, city, and graduation year.",
};

export default function DirectoryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alumni Directory</h1>
        <p className="mt-2 text-gray-600">
          Search and filter to find BYU MBA alumni across industries and
          geographies.
        </p>
      </div>
      <DirectoryFilters />
    </div>
  );
}
