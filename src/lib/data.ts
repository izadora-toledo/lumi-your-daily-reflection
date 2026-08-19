import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProfile(userId?: string) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, name, email, plan, onboarded")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function usePreferences(userId?: string) {
  return useQuery({
    queryKey: ["preferences", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_music_preferences")
        .select("user_id, genres, favorite_artists, sad_music_preference, discovery_level")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useMessages(userId?: string, onlyFavorites = false) {
  return useQuery({
    queryKey: ["messages", userId, onlyFavorites],
    enabled: !!userId,
    queryFn: async () => {
      let query = supabase
        .from("generated_messages")
        .select("id, message, favorite, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(30);
      if (onlyFavorites) query = query.eq("favorite", true);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRecommendations(userId?: string) {
  return useQuery({
    queryKey: ["recommendations", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("music_recommendations")
        .select("id, song, artist, explanation, spotify_url, feedback, mood_label, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(30);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function formatDay(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (same(date, today)) return "Hoje";
  if (same(date, yesterday)) return "Ontem";
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
}
