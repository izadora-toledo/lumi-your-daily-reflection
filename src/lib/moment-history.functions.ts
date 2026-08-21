import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMomentHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.plan !== "pro") {
      throw new Error("O histórico de momentos está disponível no Lumi Pro.");
    }

    const { data, error } = await supabase
      .from("generated_messages")
      .select(
        "id, message, favorite, created_at, mood_entries(mood_text, detected_mood, created_at)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw error;

    return (data ?? []).filter((item) => item.mood_entries?.mood_text);
  });
