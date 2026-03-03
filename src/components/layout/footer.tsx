import { Logo } from "@/components/layout/logo";

export function Footer() {
  return (
    <footer className="border-t border-[#1F2D25] bg-[#05080A]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <Logo compact href="/" />
        <p className="text-xs uppercase tracking-[0.18em] text-[#6B7F74]">
          Institutional on-chain credit infrastructure
        </p>
      </div>
    </footer>
  );
}
