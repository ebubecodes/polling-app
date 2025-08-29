import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "destructive" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonComponent({ className, variant = "default", size = "md", ...props }, ref) {
    const base = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      default: "bg-foreground text-background hover:opacity-90",
      secondary: "bg-secondary text-secondary-foreground hover:opacity-90",
      ghost: "hover:bg-muted",
      destructive: "bg-red-600 text-white hover:bg-red-700",
      outline: "border border-border bg-background hover:bg-muted",
    };
    const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
      sm: "h-8 px-3",
      md: "h-9 px-4",
      lg: "h-10 px-6",
      icon: "h-9 w-9",
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
    );
  }
);


