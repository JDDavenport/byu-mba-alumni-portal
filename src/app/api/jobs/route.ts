import { type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { dummyJobs } from "@/data/jobs";

export async function GET() {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data ?? []);
  }

  return Response.json(dummyJobs);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) {
    return Response.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { data, error } = await supabase
    .from("jobs")
    .insert(body)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(data, { status: 201 });
}
