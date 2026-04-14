export interface Job {
  id: string;
  posted_by: string | null;
  title: string;
  company: string;
  description: string;
  location: string;
  url: string;
  created_at: string;
}

export const dummyJobs: Job[] = [
  {
    id: "job-1",
    posted_by: null,
    title: "Senior Product Manager",
    company: "Qualtrics",
    description:
      "Lead product strategy for our employee experience platform. MBA preferred. BYU alumni strongly encouraged to apply.",
    location: "Provo, UT (Hybrid)",
    url: "https://qualtrics.com/careers",
    created_at: "2026-04-10T00:00:00Z",
  },
  {
    id: "job-2",
    posted_by: null,
    title: "Associate, Private Equity",
    company: "Bain Capital",
    description:
      "Join our PE team evaluating mid-market deals. 2-3 years of investment banking or consulting experience required.",
    location: "Boston, MA",
    url: "https://baincapital.com/careers",
    created_at: "2026-04-09T00:00:00Z",
  },
  {
    id: "job-3",
    posted_by: null,
    title: "Strategy Consultant",
    company: "McKinsey & Company",
    description:
      "Serve clients across industries on their most critical strategic challenges. MBA required.",
    location: "Multiple Locations",
    url: "https://mckinsey.com/careers",
    created_at: "2026-04-08T00:00:00Z",
  },
  {
    id: "job-4",
    posted_by: null,
    title: "Director of Operations",
    company: "Intermountain Health",
    description:
      "Oversee operational excellence for regional hospital network. Healthcare MBA preferred.",
    location: "Salt Lake City, UT",
    url: "https://intermountainhealth.org/careers",
    created_at: "2026-04-07T00:00:00Z",
  },
  {
    id: "job-5",
    posted_by: null,
    title: "Founder-in-Residence",
    company: "Kickstart Fund",
    description:
      "Join our venture studio to build the next great Mountain West startup. We provide funding, mentorship, and resources.",
    location: "Salt Lake City, UT",
    url: "https://kickstart.com/careers",
    created_at: "2026-04-06T00:00:00Z",
  },
];
