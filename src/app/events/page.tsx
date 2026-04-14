import type { Metadata } from "next";
import { EventsList } from "@/components/events-list";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming BYU MBA alumni events — mixers, panels, BBQs, and more.",
  openGraph: {
    title: "Events",
    description:
      "Upcoming BYU MBA alumni events — mixers, panels, BBQs, and more.",
  },
};

export default function EventsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upcoming Events</h1>
        <p className="mt-2 text-gray-600">
          Connect with fellow BYU MBA alumni at events near you or online.
        </p>
      </div>
      <EventsList />
    </div>
  );
}
