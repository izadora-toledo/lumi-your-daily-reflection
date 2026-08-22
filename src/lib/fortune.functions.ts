import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { fortunes, fortuneDateInSaoPaulo } from "@/lib/fortunes";

export const getTodayFortune = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.plan !== "pro") return null;

    const { data, error } = await supabase
      .from("fortune_cookie_history")
      .select("id, fortune_id, category, message, fortune_date, opened_at")
      .eq("user_id", userId)
      .eq("fortune_date", fortuneDateInSaoPaulo())
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const openFortuneCookie = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.plan !== "pro") {
      throw new Error("O histórico de biscoitos está disponível no Lumi Pro.");
    }

    const today = fortuneDateInSaoPaulo();
    const { data: existing, error: existingError } = await supabase
      .from("fortune_cookie_history")
      .select("id, fortune_id, category, message, fortune_date, opened_at")
      .eq("user_id", userId)
      .eq("fortune_date", today)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) return existing;

    const { data: history, error: historyError } = await supabase
      .from("fortune_cookie_history")
      .select("fortune_id")
      .eq("user_id", userId);
    if (historyError) throw historyError;

    const seen = new Set((history ?? []).map((item) => item.fortune_id));
    const available = fortunes.filter((fortune) => !seen.has(fortune.id));
    const pool = available.length ? available : fortunes;
    const selected = pool[Math.floor(Math.random() * pool.length)]!;

    const { data, error } = await supabase
      .from("fortune_cookie_history")
      .insert({
        user_id: userId,
        fortune_id: selected.id,
        category: selected.category,
        message: selected.message,
        fortune_date: today,
      })
      .select("id, fortune_id, category, message, fortune_date, opened_at")
      .single();

    if (error) {
      const { data: concurrent } = await supabase
        .from("fortune_cookie_history")
        .select("id, fortune_id, category, message, fortune_date, opened_at")
        .eq("user_id", userId)
        .eq("fortune_date", today)
        .maybeSingle();
      if (concurrent) return concurrent;
      throw error;
    }

    return data;
  });

export const getFortuneCookieHistory = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", userId)
      .maybeSingle();

    if (profile?.plan !== "pro") {
      throw new Error("O histórico de biscoitos está disponível no Lumi Pro.");
    }

    const { data, error } = await supabase
      .from("fortune_cookie_history")
      .select("id, fortune_id, category, message, fortune_date, opened_at")
      .eq("user_id", userId)
      .order("opened_at", { ascending: false })
      .limit(500);

    if (error) throw error;
    return data ?? [];
  });
