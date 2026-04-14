import Link from "next/link";
import { alumni } from "@/data/alumni";

export default function Home() {
  const cities = new Set(alumni.map((a) => `${a.city}, ${a.state}`)).size;
  const industries = new Set(alumni.map((a) => a.industry)).size;
  const mentors = alumni.filter((a) => a.willingToMentor).length;

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#002E5D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              BYU MBA Alumni Network
            </h1>
            <p className="mt-6 text-lg text-white/80 sm:text-xl">
              Your Marriott School network, everywhere. Find alumni by city,
              industry, or class year. Get mentored. Share opportunities.
              Strengthen the Cougar connection.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/directory"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-4 text-sm font-medium text-[#002E5D] transition-colors hover:bg-white/90"
              >
                Browse Directory
              </Link>
              <span className="inline-flex h-9 items-center justify-center rounded-lg border border-white/30 px-4 text-sm font-medium text-white opacity-50">
                Find Alumni Near You (coming soon)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <StatCard number="5,000+" label="MBA Alumni" />
            <StatCard number={`${cities}+`} label="Cities" />
            <StatCard number={`${industries}+`} label="Industries" />
            <StatCard number={`${mentors}`} label="Available Mentors" />
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
          Why Join the Network?
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <ValueProp
            title="Find Alumni Near You"
            description="Moving to a new city? Discover BYU MBAs already there. Get advice on neighborhoods, employers, and community before you arrive."
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <ValueProp
            title="Get Mentored"
            description="Connect with alumni who have walked your path. Finance, tech, consulting, healthcare — find mentors who understand BYU values and your career goals."
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <ValueProp
            title="Share Opportunities"
            description="Job openings, referrals, and business partnerships flow through trusted networks. The BYU MBA alumni network is one of the strongest in the Mountain West."
            icon={
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        </div>
      </section>

      {/* Recent Alumni Preview */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Recently Added Alumni
            </h2>
            <Link
              href="/directory"
              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              View All
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {alumni.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                href={`/alumni/${a.id}`}
                className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.avatarUrl}
                    alt={a.name}
                    className="h-10 w-10 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#002E5D]">
                      {a.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {a.title} at {a.company}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-[#002E5D] sm:text-4xl">{number}</p>
      <p className="mt-1 text-sm text-gray-600">{label}</p>
    </div>
  );
}

function ValueProp({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-[#002E5D]/10 text-[#002E5D]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
