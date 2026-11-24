import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#2f6bff] text-white hover:bg-[#2563eb] shadow-[0_10px_30px_-10px_rgba(47,107,255,0.8)]",
  secondary:
    "bg-[#eff6ff] text-[#1d4ed8] hover:bg-[#dbeafe] border border-[#bfdbfe]",
  ghost: "bg-transparent text-[#1e293b] hover:bg-[#f1f5f9]",
  dark: "bg-[#0b1220] text-white hover:bg-[#1e293b]",
  outline:
    "bg-transparent text-[#0b1220] border border-[#cbd5e1] hover:border-[#2f6bff] hover:text-[#1d4ed8]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-lg gap-1.5",
  md: "h-11 px-5 text-sm rounded-xl gap-2",
  lg: "h-13 px-7 text-base rounded-xl gap-2.5",
};

const base =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-3 focus-visible:outline-offset-2";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
