import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading, user: session?.user ?? null };
}

export const GENRES = [
  "Pop",
  "Rock",
  "Indie",
  "MPB",
  "Sertanejo",
  "Pagode",
  "Rap",
  "R&B",
  "Eletrônica",
  "Gospel",
  "K-pop",
  "Reggae",
  "Música clássica",
  "Outros",
];

export const MOOD_CHIPS = [
  "Feliz",
  "Triste",
  "Ansiosa",
  "Cansada",
  "Desmotivada",
  "Com esperança",
  "Apaixonada",
  "Confusa",
];

export const SAD_PREFERENCES = [
  { value: "combinar", label: "Músicas que combinem com minha tristeza" },
  { value: "melhorar", label: "Músicas que me façam melhorar" },
  { value: "depende", label: "Depende do momento" },
];
