import { type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getAlumniById } from "@/data/alumni";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("alumni")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return Response.json({ error: "Alumni not found" }, { status: 404 });
    }

    const mapped = {
      id: data.id,
      name: data.name,
      graduationYear: data.graduation_year,
      company: data.company,
      title: data.title,
      industry: data.industry,
      city: data.city,
      state: data.state,
      lat: data.lat,
      lng: data.lng,
      linkedinUrl: data.linkedin_url,
      avatarUrl: data.avatar_url,
      bio: data.bio,
      skills: data.skills,
      willingToMentor: data.willing_to_mentor,
    };

    return Response.json(mapped);
  }

  // Static fallback
  const alumni = getAlumniById(id);
  if (!alumni) {
    return Response.json({ error: "Alumni not found" }, { status: 404 });
  }
  return Response.json(alumni);
}
