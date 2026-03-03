import { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-[#1F2D25] bg-[#101A1F] p-6 shadow-[0_0_28px_rgba(0,255,136,0.12)]">
      <header className="mb-4">
        <h2 className="text-lg font-semibold text-[#E6F5EC]">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-[#9EB5A5]">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
