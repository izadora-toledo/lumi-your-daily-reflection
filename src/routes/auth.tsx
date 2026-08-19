import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hand, LumiMark } from "@/components/lumi/chrome";

type Mode = "login" | "signup";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode: Mode } => ({
    mode: search["mode"] === "login" ? "login" : "signup",
  }),
  head: () => ({
    meta: [
      { title: "Entrar na Lumi" },
      { name: "description", content: "Crie sua conta na Lumi para guardar mensagens e descobrir músicas." },
      { property: "og:title", content: "Entrar na Lumi" },
      { property: "og:description", content: "Guarde suas mensagens favoritas e monte a sua trilha." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Confira seu e-mail para confirmar o cadastro.");
          return;
        }
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/dashboard" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não consegui continuar agora.");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Não consegui entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="soft-gradient flex min-h-screen flex-col items-center justify-center px-5 py-12">
      <LumiMark />
      <div className="mt-8 w-full max-w-sm rounded-3xl border border-border/70 bg-card p-7 shadow-soft animate-fade-up">
        <Hand>{mode === "signup" ? "que bom te ver" : "de volta"}</Hand>
        <h1 className="mt-1 text-2xl font-bold">
          {mode === "signup" ? "Criar minha conta" : "Entrar na Lumi"}
        </h1>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="h-11 rounded-2xl" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11 rounded-2xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required className="h-11 rounded-2xl" />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Um instante..." : mode === "signup" ? "Criar conta" : "Entrar"}
          </Button>
        </form>

        <Button variant="outline" className="mt-3 w-full" onClick={google}>
          Continuar com Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Já tem conta? " : "Ainda não tem conta? "}
          <Link
            to="/auth"
            search={{ mode: mode === "signup" ? "login" : "signup" }}
            className="font-semibold text-primary"
          >
            {mode === "signup" ? "Entrar" : "Criar agora"}
          </Link>
        </p>
      </div>
      <Link to="/" className="mt-6 text-xs text-muted-foreground hover:text-foreground">
        Voltar para o início
      </Link>
    </div>
  );
}
