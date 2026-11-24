import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0b1220] placeholder:text-[#94a3b8] transition-colors focus:border-[#2f6bff] focus:outline-none focus:ring-4 focus:ring-[#2f6bff]/10",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-[#1e293b]">{label}</span>
      {children}
      {hint && <span className="block text-xs text-[#64748b]">{hint}</span>}
    </label>
  );
}
