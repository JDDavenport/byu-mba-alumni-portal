# BYU MBA Alumni Portal — Validation Questions

Checklist of questions to resolve with the MBA Office before starting Phase 1.

---

## Data

- [ ] Can we get a CSV export of alumni records from the registrar?
- [ ] What fields are available? (name, email, graduation year, program, employer, location?)
- [ ] How many total alumni records are we talking about? (hundreds? thousands?)
- [ ] How often is this data updated? Is there an ongoing feed or a one-time export?
- [ ] Are alumni email addresses current, or do many bounce?

## Authentication

- [ ] Is LinkedIn OAuth acceptable as the primary sign-in method?
- [ ] Is BYU CAS / SSO integration required or preferred?
- [ ] Should current students also have access, or alumni only?
- [ ] Do alumni need to claim/verify their profile, or is it pre-populated?

## Branding

- [ ] Can we use official Marriott School of Business logos?
- [ ] Are there brand guidelines (colors, fonts, tone) we should follow?
- [ ] Is there an existing style guide or asset kit?
- [ ] Does the design need approval from BYU Communications or another office?

## Domain & Hosting

- [ ] Preferred domain? (e.g., alumni.byumba.com, mbaalumni.byu.edu)
- [ ] Does it need to live under a byu.edu subdomain, or can it be external?
- [ ] Is there budget for hosting? (estimated $50-150/month for Vercel + Supabase)
- [ ] Any BYU IT requirements for hosting or infrastructure?

## Scope & Features

- [ ] Which Phase 2 features matter most? (Mentorship matching? Event management? Job board?)
- [ ] Is there an existing alumni events calendar we should integrate with?
- [ ] Are there other tools this should connect to? (Salesforce, Slate, Handshake, etc.)
- [ ] Should the portal include MBA program news or just alumni networking?

## Administration

- [ ] Who manages content day-to-day? (MBA Office staff? Student workers?)
- [ ] How many admin users do we need to support?
- [ ] What admin actions are needed? (approve profiles, post events, moderate jobs?)
- [ ] Is there a content approval workflow, or can admins publish directly?

## Privacy & Compliance

- [ ] Are there BYU-specific data privacy policies we need to follow?
- [ ] Does FERPA apply to alumni data, or only current students?
- [ ] Can alumni opt out of being listed in the directory?
- [ ] Do we need a privacy policy or terms of service reviewed by BYU legal?

## Timeline

- [ ] When does the MBA Office want this live?
- [ ] Is there a specific event or deadline driving the timeline? (e.g., homecoming, reunion)
- [ ] Are there any blackout periods where we can't launch? (finals, holidays)

## Budget

- [ ] Is there budget allocated for this project?
- [ ] Hosting costs: ~$50-150/month (Vercel Pro + Supabase Pro)
- [ ] Domain costs: ~$15/year if using a custom domain
- [ ] Any budget for ongoing maintenance or feature development?

---

**Next step after validation**: Compile answers into a Phase 1 requirements doc and begin implementation.
