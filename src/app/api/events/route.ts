import { type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { dummyEvents } from "@/data/events";

export async function GET() {
  const supabase = getSupabase();

  if (supabase) {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", new Date().toISOString())
      .order("date", { ascending: true });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data ?? []);
  }

  return Response.json(dummyEvents);
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
    .from("events")
    .insert(body)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(data, { status: 201 });
}
