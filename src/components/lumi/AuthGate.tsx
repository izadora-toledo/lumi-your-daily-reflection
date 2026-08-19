import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LumiMark } from "@/components/lumi/chrome";
import { useSession } from "@/lib/session";

export function AuthGate({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { user, loading } = useSession();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { mode: "login" }, replace: true });
    }
  }, [loading, navigate, user]);

  if (loading || !user) {
    return (
      <div className="soft-gradient flex min-h-screen flex-col items-center justify-center gap-5">
        <LumiMark />
        <div className="flex gap-2" aria-label="Carregando">
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="h-2.5 w-2.5 animate-float rounded-full bg-primary/70"
              style={{ animationDelay: `${item * 0.18}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return children;
}
