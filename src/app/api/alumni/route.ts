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
    let query = supabase.from("alumni").select("*");

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

    query = query.order("name");

    const { data, error } = await query;

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    // Map snake_case back to camelCase for the frontend
    const mapped = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      graduationYear: row.graduation_year,
      company: row.company,
      title: row.title,
      industry: row.industry,
      city: row.city,
      state: row.state,
      lat: row.lat,
      lng: row.lng,
      linkedinUrl: row.linkedin_url,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      skills: row.skills,
      willingToMentor: row.willing_to_mentor,
    }));

    return Response.json(mapped);
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
