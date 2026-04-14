import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/directory";

  if (code) {
    const supabase = getSupabase();
    if (supabase) {
      // Exchange the code for a session
      // Note: for server-side auth exchange you'd typically use
      // createServerClient from @supabase/ssr. This is scaffolding
      // that will be completed when auth is fully wired up.
      // await supabase.auth.exchangeCodeForSession(code);
    }
  }

  redirect(next);
}
