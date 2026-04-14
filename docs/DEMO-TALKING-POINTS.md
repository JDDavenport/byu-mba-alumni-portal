# BYU MBA Alumni Portal — Demo Talking Points

**Audience**: BYU Marriott School MBA Office
**Format**: Laptop walkthrough, ~15 minutes
**Status**: Phase 0 complete (frontend with 50 dummy alumni records)

---

## 1. The Problem

- MBA alumni lose touch with each other and the program after graduation
- No centralized, searchable directory of alumni — just scattered LinkedIn connections
- The MBA Office has no easy way to connect current students with alumni mentors
- Event promotion and job sharing happen ad-hoc through email blasts with low engagement

## 2. The Solution

An interactive alumni portal that gives the MBA Office a modern, branded platform for:
- **Directory** — searchable, filterable alumni database
- **Map** — visual geographic view of the alumni network worldwide
- **Mentorship** — connect current students with alumni by industry/location
- **Events** — centralized alumni event listings
- **Jobs** — alumni-to-alumni job board

---

## 3. Demo Walkthrough

### Landing Page (`/`)
> "This is the front door. Clean, branded, immediate value proposition. Alumni can sign up or browse right away."
- Show the hero section and value props
- Point out mobile-responsive layout
- Note: branding can be updated to match official Marriott School guidelines

### Directory (`/directory`)
> "The core of the portal. Search by name, filter by graduation year, industry, or location."
- Type a name in the search bar — show instant filtering
- Filter by graduation year
- Click into a profile card
- Emphasize: "This works with 50 records today; it will work the same with 5,000."

### Alumni Profile (`/alumni/[id]`)
> "Each alum gets a profile page. Contact info, career history, willingness to mentor."
- Walk through the profile fields
- Note the mentorship availability toggle (Phase 1 feature)

### Map (`/map`)
> "This is the wow factor. Every alum plotted on a world map. Click a pin, see who's there."
- Zoom into a cluster (e.g., Salt Lake City, NYC)
- Click a pin to see the alumni card
- "Imagine a prospective student asking 'Are there BYU MBA grads in Austin?' — one click."

### Events (`/events`)
> "Alumni events in one place. No more email chains."
- Show upcoming events list
- Note RSVP functionality placeholder (Phase 1)

### Jobs (`/jobs`)
> "Alumni helping alumni. Post jobs, find talent within the network."
- Show job listings
- Note: posting and application flow comes in Phase 1

### Auth (`/auth`)
> "Sign-in page ready for LinkedIn OAuth or BYU SSO — whichever you prefer."
- Show the auth page layout
- Explain: currently static, real auth is Phase 1

---

## 4. Technical Highlights

- **Next.js** — production-grade React framework, used by Fortune 500 companies
- **Static generation** — pages load instantly, great SEO
- **Real-time search** — client-side filtering, no loading spinners
- **Responsive** — works on phone, tablet, laptop
- **Accessible** — built with semantic HTML and ARIA patterns
- **Deployable today** — Vercel hosting, zero-config deployment

---

## 5. What's Ready Now (Phase 0)

| Feature | Status |
|---------|--------|
| Landing page | Done |
| Alumni directory with search/filter | Done |
| Individual alumni profiles | Done |
| Interactive world map | Done |
| Events listing page | Done |
| Jobs listing page | Done |
| Auth page layout | Done |
| 50 dummy alumni records | Done |
| Mobile responsive design | Done |

All frontend. No backend, no real data, no auth. This is the pitch version.

---

## 6. What Comes Next (Phase 1)

| Feature | Description |
|---------|-------------|
| Supabase backend | Postgres database, row-level security |
| Real authentication | LinkedIn OAuth + optional BYU SSO |
| Registrar data import | Bulk CSV import of real alumni records |
| Profile self-service | Alumni update their own profiles |
| RSVP for events | Register for events through the portal |
| Job posting flow | Alumni submit and manage job listings |
| Admin dashboard | MBA Office manages content and users |

Estimated Phase 1 timeline: 4-6 weeks after approval.

---

## 7. Questions for the MBA Office

See `VALIDATION-QUESTIONS.md` for the full checklist. Key asks during the demo:

1. Does this direction resonate? Is this what you'd want alumni to use?
2. Can we get a CSV export of alumni data to populate the real directory?
3. Are there official Marriott School brand assets we should use?
4. Who on your team would be the day-to-day admin?

---

## 8. The Ask

1. **Approval** to proceed to Phase 1
2. **Alumni data** — a CSV from the registrar (name, graduation year, email, program)
3. **Brand assets** — logos, color codes, fonts
4. **Point of contact** — one person on the MBA Office team for weekly check-ins
