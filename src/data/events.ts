export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  city: string;
  state: string;
  organizer_id: string | null;
  max_attendees: number;
  created_at: string;
}

export const dummyEvents: Event[] = [
  {
    id: "evt-1",
    title: "BYU MBA Networking Mixer - NYC",
    description:
      "Join fellow BYU MBA alumni in New York City for an evening of networking, appetizers, and catching up. All graduation years welcome.",
    date: "2026-05-15T18:00:00Z",
    location: "The Yale Club, 50 Vanderbilt Ave",
    city: "New York",
    state: "NY",
    organizer_id: null,
    max_attendees: 75,
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "evt-2",
    title: "Silicon Valley Tech Panel",
    description:
      "Hear from BYU MBA alumni leading product and engineering teams at top tech companies. Q&A and networking to follow.",
    date: "2026-05-22T17:30:00Z",
    location: "WeWork, 535 Mission St",
    city: "San Francisco",
    state: "CA",
    organizer_id: null,
    max_attendees: 50,
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "evt-3",
    title: "Utah County Alumni BBQ",
    description:
      "Annual summer BBQ for BYU MBA alumni and families in Utah County. Bring your favorite side dish!",
    date: "2026-06-14T11:00:00Z",
    location: "Kiwanis Park, Provo",
    city: "Provo",
    state: "UT",
    organizer_id: null,
    max_attendees: 150,
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "evt-4",
    title: "Healthcare Industry Roundtable",
    description:
      "A focused discussion on trends in healthcare management and consulting. BYU MBA alumni in healthcare share insights and career advice.",
    date: "2026-06-05T12:00:00Z",
    location: "Virtual (Zoom)",
    city: "Virtual",
    state: "",
    organizer_id: null,
    max_attendees: 100,
    created_at: "2026-04-01T00:00:00Z",
  },
  {
    id: "evt-5",
    title: "Denver Alumni Hike & Brunch",
    description:
      "Join us for a morning hike at Red Rocks followed by brunch. Great way to meet BYU MBAs in the Denver metro area.",
    date: "2026-07-12T08:00:00Z",
    location: "Red Rocks Amphitheatre Trailhead",
    city: "Denver",
    state: "CO",
    organizer_id: null,
    max_attendees: 30,
    created_at: "2026-04-01T00:00:00Z",
  },
];
