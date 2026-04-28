import { type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getAlumniById } from "@/data/alumni";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();

  // ---------- Supabase path ----------
  if (supabase) {
    const { data, error } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      return Response.json({ error: "Alumni not found" }, { status: 404 });
    }

    // Map snake_case DB columns to camelCase for the frontend
    const mapped = {
      id: data.id,
      name: data.name,
      firstName: data.first_name,
      lastName: data.last_name,
      graduationYear: data.graduation_year,
      degree: data.degree,
      company: data.company,
      title: data.title,
      industry: data.industry,
      city: data.city,
      state: data.state,
      country: data.country,
      lat: data.lat,
      lng: data.lng,
      linkedinUrl: data.linkedin_url,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      skills: data.skills ?? [],
      careerHistory: data.career_history ?? [],
      willingToMentor: data.willing_to_mentor,
      mentorTopics: data.mentor_topics ?? [],
      mentorAvailability: data.mentor_availability,
      showEmail: data.show_email,
      email: data.show_email ? data.email : null,
      phone: data.show_phone ? data.phone : null,
      byuEmailVerified: data.byu_email_verified,
      isClaimed: data.is_claimed,
    };

    return Response.json(mapped);
  }

  // ---------- Static fallback ----------
  const alumni = getAlumniById(id);
  if (!alumni) {
    return Response.json({ error: "Alumni not found" }, { status: 404 });
  }
  return Response.json(alumni);
}
