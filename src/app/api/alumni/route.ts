import { type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { alumni as staticAlumni } from "@/data/alumni";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const q = searchParams.get("q")?.toLowerCase();
  const industry = searchParams.get("industry");
  const company = searchParams.get("company");
  const city = searchParams.get("city");
  const yearMin = searchParams.get("year_min");
  const yearMax = searchParams.get("year_max");

  const supabase = getSupabase();

  // ---------- Supabase path ----------
  if (supabase) {
    // Only select fields needed for directory cards (not full profile)
    let query = supabase
      .from("alumni")
      .select(
        "id, name, first_name, last_name, graduation_year, degree, company, title, industry, city, state, country, lat, lng, linkedin_url, avatar_url, bio, skills, willing_to_mentor, byu_email_verified"
      )
      .eq("is_active", true)
      .eq("show_in_directory", true);

    if (q) {
      query = query.or(
        `name.ilike.%${q}%,company.ilike.%${q}%,title.ilike.%${q}%,city.ilike.%${q}%`
      );
    }
    if (industry) query = query.eq("industry", industry);
    if (company) query = query.eq("company", company);
    if (city) {
      // city param comes as "City, ST"
      const parts = city.split(", ");
      if (parts.length === 2) {
        query = query.eq("city", parts[0]).eq("state", parts[1]);
      }
    }
    if (yearMin) query = query.gte("graduation_year", parseInt(yearMin));
    if (yearMax) query = query.lte("graduation_year", parseInt(yearMax));

    // Pagination support
    const page = parseInt(searchParams.get("page") ?? "1");
    const pageSize = parseInt(searchParams.get("page_size") ?? "100");
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    query = query.order("name").range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Map snake_case back to camelCase for the frontend
    const mapped = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      graduationYear: row.graduation_year,
      degree: row.degree,
      company: row.company,
      title: row.title,
      industry: row.industry,
      city: row.city,
      state: row.state,
      country: row.country,
      lat: row.lat,
      lng: row.lng,
      linkedinUrl: row.linkedin_url,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      skills: row.skills ?? [],
      willingToMentor: row.willing_to_mentor,
      byuEmailVerified: row.byu_email_verified,
    }));

    return Response.json(mapped, {
      headers: count != null ? { "X-Total-Count": String(count) } : {},
    });
  }

  // ---------- Static fallback ----------
  let results = [...staticAlumni];

  if (q) {
    results = results.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q)
    );
  }
  if (industry) results = results.filter((a) => a.industry === industry);
  if (company) results = results.filter((a) => a.company === company);
  if (city) {
    results = results.filter((a) => `${a.city}, ${a.state}` === city);
  }
  if (yearMin)
    results = results.filter((a) => a.graduationYear >= parseInt(yearMin));
  if (yearMax)
    results = results.filter((a) => a.graduationYear <= parseInt(yearMax));

  return Response.json(results);
}
