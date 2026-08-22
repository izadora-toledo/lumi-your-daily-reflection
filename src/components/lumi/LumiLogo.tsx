import { cn } from "@/lib/utils";

type LumiLogoProps = {
  className?: string;
  iconClassName?: string;
  compact?: boolean;
};

export function LumiSymbol({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("shrink-0", className)}
      viewBox="0 0 72 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M34.25 32.75C23.35 31.24 11.63 23.3 8.5 10.25C20.58 9.78 31.11 18.39 34.25 32.75Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M37.75 32.75C48.65 31.24 60.37 23.3 63.5 10.25C51.42 9.78 40.89 18.39 37.75 32.75Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="46.5" r="7.5" fill="currentColor" />
    </svg>
  );
}

export function LumiLogo({ className, iconClassName, compact = false }: LumiLogoProps) {
  return (
    <span className={cn("inline-flex items-center", compact ? "gap-1.5" : "gap-2.5", className)}>
      <LumiSymbol className={cn("text-primary", compact ? "h-7 w-8" : "h-9 w-11", iconClassName)} />
      <span
        className={cn(
          "font-bold tracking-[-0.04em] text-foreground",
          compact ? "text-base" : "text-xl",
        )}
      >
        Lum
        <span
          aria-label="i"
          className="relative inline-block h-[0.84em] w-[0.32em] align-[-0.02em]"
        >
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 h-[0.56em] w-[0.22em] -translate-x-1/2 rounded-[0.04em] bg-foreground"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-0 h-[0.22em] w-[0.22em] -translate-x-1/2 rounded-full bg-primary"
          />
        </span>
      </span>
    </span>
  );
}
