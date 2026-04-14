/**
 * Seed script — inserts dummy alumni into Supabase.
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * environment variables (or a .env.local file loaded via dotenv).
 */

import { createClient } from "@supabase/supabase-js";
import { alumni } from "../src/data/alumni";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

async function seed() {
  console.log(`Seeding ${alumni.length} alumni...`);

  // Map camelCase fields to snake_case DB columns
  const rows = alumni.map((a) => ({
    name: a.name,
    graduation_year: a.graduationYear,
    company: a.company,
    title: a.title,
    industry: a.industry,
    city: a.city,
    state: a.state,
    lat: a.lat,
    lng: a.lng,
    linkedin_url: a.linkedinUrl,
    avatar_url: a.avatarUrl,
    bio: a.bio,
    skills: a.skills,
    willing_to_mentor: a.willingToMentor,
  }));

  const { data, error } = await supabase.from("alumni").upsert(rows, {
    onConflict: "email",
    ignoreDuplicates: true,
  });

  if (error) {
    // If upsert on email fails (no email in dummy data), try plain insert
    console.log("Upsert failed, trying insert...", error.message);
    const { error: insertError } = await supabase.from("alumni").insert(rows);
    if (insertError) {
      console.error("Insert failed:", insertError.message);
      process.exit(1);
    }
  }

  console.log("Seed complete.", data ? `${(data as unknown[]).length} rows` : "");

  // Seed some sample events
  const sampleEvents = [
    {
      title: "BYU MBA Networking Mixer - NYC",
      description:
        "Join fellow BYU MBA alumni in New York City for an evening of networking, appetizers, and catching up. All graduation years welcome.",
      date: "2026-05-15T18:00:00Z",
      location: "The Yale Club, 50 Vanderbilt Ave",
      city: "New York",
      state: "NY",
      max_attendees: 75,
    },
    {
      title: "Silicon Valley Tech Panel",
      description:
        "Hear from BYU MBA alumni leading product and engineering teams at top tech companies. Q&A and networking to follow.",
      date: "2026-05-22T17:30:00Z",
      location: "WeWork, 535 Mission St",
      city: "San Francisco",
      state: "CA",
      max_attendees: 50,
    },
    {
      title: "Utah County Alumni BBQ",
      description:
        "Annual summer BBQ for BYU MBA alumni and families in Utah County. Bring your favorite side dish!",
      date: "2026-06-14T11:00:00Z",
      location: "Kiwanis Park, Provo",
      city: "Provo",
      state: "UT",
      max_attendees: 150,
    },
    {
      title: "Healthcare Industry Roundtable",
      description:
        "A focused discussion on trends in healthcare management and consulting. BYU MBA alumni in healthcare share insights and career advice.",
      date: "2026-06-05T12:00:00Z",
      location: "Virtual (Zoom)",
      city: "Virtual",
      state: "",
      max_attendees: 100,
    },
    {
      title: "Denver Alumni Hike & Brunch",
      description:
        "Join us for a morning hike at Red Rocks followed by brunch. Great way to meet BYU MBAs in the Denver metro area.",
      date: "2026-07-12T08:00:00Z",
      location: "Red Rocks Amphitheatre Trailhead",
      city: "Denver",
      state: "CO",
      max_attendees: 30,
    },
  ];

  const { error: eventsError } = await supabase
    .from("events")
    .insert(sampleEvents);
  if (eventsError) {
    console.error("Events seed failed:", eventsError.message);
  } else {
    console.log(`Seeded ${sampleEvents.length} events.`);
  }

  // Seed some sample jobs
  const sampleJobs = [
    {
      title: "Senior Product Manager",
      company: "Qualtrics",
      description:
        "Lead product strategy for our employee experience platform. MBA preferred. BYU alumni strongly encouraged to apply.",
      location: "Provo, UT (Hybrid)",
      url: "https://qualtrics.com/careers",
    },
    {
      title: "Associate, Private Equity",
      company: "Bain Capital",
      description:
        "Join our PE team evaluating mid-market deals. 2-3 years of investment banking or consulting experience required.",
      location: "Boston, MA",
      url: "https://baincapital.com/careers",
    },
    {
      title: "Strategy Consultant",
      company: "McKinsey & Company",
      description:
        "Serve clients across industries on their most critical strategic challenges. MBA required.",
      location: "Multiple Locations",
      url: "https://mckinsey.com/careers",
    },
    {
      title: "Director of Operations",
      company: "Intermountain Health",
      description:
        "Oversee operational excellence for regional hospital network. Healthcare MBA preferred.",
      location: "Salt Lake City, UT",
      url: "https://intermountainhealth.org/careers",
    },
    {
      title: "Founder-in-Residence",
      company: "Kickstart Fund",
      description:
        "Join our venture studio to build the next great Mountain West startup. We provide funding, mentorship, and resources.",
      location: "Salt Lake City, UT",
      url: "https://kickstart.com/careers",
    },
  ];

  const { error: jobsError } = await supabase.from("jobs").insert(sampleJobs);
  if (jobsError) {
    console.error("Jobs seed failed:", jobsError.message);
  } else {
    console.log(`Seeded ${sampleJobs.length} jobs.`);
  }
}

seed();
