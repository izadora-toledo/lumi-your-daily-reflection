import { supabase } from "@/integrations/supabase/client";
import type { Prefs } from "@/components/lumi/PrefsForm";

export async function savePrefs(userId: string, p: Prefs) {
  const { error } = await supabase.from("user_music_preferences").upsert(
    {
      user_id: userId,
      genres: p.genres,
      favorite_artists: p.favorite_artists.slice(0, 300),
      sad_music_preference: p.sad_music_preference,
      discovery_level: p.discovery_level,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
  const { error: e2 } = await supabase.from("profiles").update({ onboarded: true }).eq("id", userId);
  if (e2) throw e2;
}
