import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { alumni, getAlumniById, type Alumni } from "@/data/alumni";
import { getSupabaseServer } from "@/lib/supabase";

/**
 * Fetch a single alumni profile from Supabase, falling back to static data.
 */
async function fetchAlumni(id: string): Promise<Alumni | null> {
  const supabase = getSupabaseServer();

  if (supabase) {
    const { data } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (data) {
      return {
        id: data.id,
        name: data.name,
        graduationYear: data.graduation_year,
        company: data.company ?? "",
        title: data.title ?? "",
        industry: data.industry ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        lat: data.lat ?? 0,
        lng: data.lng ?? 0,
        linkedinUrl: data.linkedin_url ?? "",
        avatarUrl: data.avatar_url ?? "",
        bio: data.bio ?? "",
        skills: data.skills ?? [],
        willingToMentor: data.willing_to_mentor ?? false,
      };
    }
  }

  // Static fallback
  return getAlumniById(id) ?? null;
}

export function generateStaticParams() {
  return alumni.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const a = await fetchAlumni(id);
  if (!a) return { title: "Alumni Not Found" };
  const description = `${a.name} — ${a.title} at ${a.company}. BYU MBA Class of ${a.graduationYear}.`;
  return {
    title: a.name,
    description,
    openGraph: {
      title: a.name,
      description,
    },
  };
}

export default async function AlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await fetchAlumni(id);

  if (!a) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <Link
        href="/directory"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Directory
      </Link>

      <Card>
        <CardContent className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={a.avatarUrl}
              alt={a.name}
              className="h-24 w-24 shrink-0 rounded-full"
              width={96}
              height={96}
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-[#002E5D]">{a.name}</h1>
                {a.willingToMentor && (
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Available as Mentor
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-lg text-gray-700">
                {a.title} at {a.company}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {a.city}, {a.state}
                </span>
                <span>Class of {a.graduationYear}</span>
                <Badge variant="outline">{a.industry}</Badge>
              </div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Bio */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              About
            </h2>
            <p className="mt-2 leading-relaxed text-gray-700">{a.bio}</p>
          </div>

          <Separator className="my-6" />

          {/* Skills */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Skills & Expertise
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {a.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <a
              href={a.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#002E5D] px-2.5 text-sm font-medium text-white transition-colors hover:bg-[#002E5D]/90"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              View LinkedIn Profile
            </a>
            <Button variant="outline" disabled>
              Send Message (coming soon)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
