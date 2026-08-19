import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  generateMotivationalMessage,
  generateMusicRecommendation,
  spotifySearchUrl,
  type MusicPrefs,
} from "./ai.server";

export const generatePublicMessage = createServerFn({ method: "POST" })
  .inputValidator((input: { moodText: string }) => {
    const moodText = (input?.moodText ?? "").trim();
    if (!moodText) throw new Error("Conte como você está se sentindo.");
    return { moodText: moodText.slice(0, 300) };
  })
  .handler(async ({ data }) => generateMotivationalMessage(data.moodText));

export const generateForUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { moodText: string }) => {
    const moodText = (input?.moodText ?? "").trim();
    if (!moodText) throw new Error("Conte como você está se sentindo.");
    return { moodText: moodText.slice(0, 300) };
  })
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();
    const isPro = profile?.plan === "pro";

    if (!isPro) {
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("generated_messages")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", since.toISOString());
      if ((count ?? 0) >= 3) {
        throw new Error(
          "Você já recebeu suas 3 mensagens de hoje no plano Free. Assine o Lumi Pro para mensagens ilimitadas.",
        );
      }
    }

    const result = await generateMotivationalMessage(data.moodText);

    const { data: entry } = await supabase
      .from("mood_entries")
      .insert({ user_id: userId, mood_text: data.moodText, detected_mood: result.mood })
      .select("id")
      .single();

    const moodEntryId = entry?.id ?? null;

    const { data: saved } = await supabase
      .from("generated_messages")
      .insert({ user_id: userId, mood_entry_id: moodEntryId, message: result.message })
      .select("id, message, favorite, created_at")
      .single();

    let recommendation = null;
    if (isPro && !result.risk) {
      try {
        const { data: prefsRow } = await supabase
          .from("user_music_preferences")
          .select("genres, favorite_artists, sad_music_preference, discovery_level")
          .eq("user_id", userId)
          .maybeSingle();

        const prefs: MusicPrefs = {
          genres: prefsRow?.genres ?? [],
          favoriteArtists: prefsRow?.favorite_artists ?? "",
          sadMusicPreference: prefsRow?.sad_music_preference ?? "depende",
          discoveryLevel: prefsRow?.discovery_level ?? 3,
        };

        const rec = await generateMusicRecommendation(data.moodText, prefs);
        const { data: savedRec } = await supabase
          .from("music_recommendations")
          .insert({
            user_id: userId,
            mood_entry_id: moodEntryId,
            song: rec.song,
            artist: rec.artist,
            explanation: rec.explanation,
            spotify_url: spotifySearchUrl(rec.song, rec.artist),
            mood_label: result.mood,
          })
          .select("id, song, artist, explanation, spotify_url, feedback")
          .single();
        recommendation = savedRec ?? null;
      } catch (error) {
        console.error("music recommendation failed", error);
      }
    }

    return {
      messageId: saved?.id ?? null,
      message: result.message,
      risk: result.risk,
      mood: result.mood,
      isPro,
      recommendation,
    };
  });
