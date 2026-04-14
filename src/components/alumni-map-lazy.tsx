"use client";

import dynamic from "next/dynamic";

const AlumniMap = dynamic(
  () => import("@/components/alumni-map").then((m) => m.AlumniMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading map...</p>
      </div>
    ),
  }
);

export function AlumniMapLazy() {
  return <AlumniMap />;
}
