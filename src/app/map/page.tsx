import type { Metadata } from "next";
import { AlumniMapLazy } from "@/components/alumni-map-lazy";

export const metadata: Metadata = {
  title: "Alumni Map",
  description:
    "Explore where BYU MBA alumni are located worldwide. Filter by industry, graduation year, and more.",
  openGraph: {
    title: "Alumni Map",
    description:
      "Explore where BYU MBA alumni are located worldwide. Filter by industry, graduation year, and more.",
  },
};

export default function MapPage() {
  return <AlumniMapLazy />;
}
