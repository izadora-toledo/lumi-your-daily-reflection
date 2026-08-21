import { Toaster as Sonner } from "sonner";
import { CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheck className="h-5 w-5 text-emerald-600" />,
        error: <CircleAlert className="h-5 w-5 text-red-500" />,
        info: <Info className="h-5 w-5 text-primary" />,
        warning: <CircleAlert className="h-5 w-5 text-amber-500" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin text-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:rounded-2xl group-[.toaster]:border-primary/15 group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:shadow-soft",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
