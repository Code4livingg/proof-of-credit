import Link from "next/link";

type LogoProps = {
  compact?: boolean;
  href?: string;
};

export function Logo({ compact = false, href = "/" }: LogoProps) {
  const logoGraphic = (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 64"
      className="h-9 w-9 shrink-0"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="poc-emerald" x1="6" y1="8" x2="58" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FF88" />
          <stop offset="0.52" stopColor="#3DFF74" />
          <stop offset="1" stopColor="#00A65A" />
        </linearGradient>
      </defs>
      <path d="M32 6L54 14V30C54 44 44.8 54.5 32 59C19.2 54.5 10 44 10 30V14L32 6Z" fill="url(#poc-emerald)" />
      <path d="M32 12L49 18.2V30C49 39.8 42.9 47.8 32 51.8C21.1 47.8 15 39.8 15 30V18.2L32 12Z" fill="#07120D" />
      <path d="M13.8 25.7L26.8 36.5L49 15V21.8L27 44.1L13 31.8L13.8 25.7Z" fill="url(#poc-emerald)" />
    </svg>
  );

  return (
    <Link href={href} className="group inline-flex items-center gap-3" aria-label="ProofOfCredit Home">
      {logoGraphic}
      {!compact ? (
        <span className="bg-gradient-to-r from-[#7DFFA8] via-[#22F07B] to-[#C8FF8A] bg-clip-text text-xl font-semibold tracking-tight text-transparent [text-shadow:0_0_20px_rgba(0,255,136,0.22)]">
          ProofOfCredit
        </span>
      ) : null}
    </Link>
  );
}
