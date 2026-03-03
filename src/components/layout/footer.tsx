import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { deployedProofOfCreditAddress } from "@/lib/contracts/proofOfCredit";

const productLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/repayments", label: "Repayments" },
  { href: "/governance", label: "Governance" },
  { href: "/protocol", label: "Protocol" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
];

const contactLinks = [
  { href: "https://github.com/Code4livingg/proof-of-credit", label: "GitHub" },
  { href: "https://t.me", label: "Telegram" },
  { href: "https://twitter.com", label: "Twitter" },
  { href: "mailto:team@proofofcredit.xyz", label: "Email" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#1A2B23] bg-[#05070A]">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        <div className="space-y-3">
          <Logo compact href="/" />
          <p className="max-w-sm text-sm leading-relaxed text-[#9EB5A5]">
            Regulatory-grade on-chain credit infrastructure for deterministic lending operations.
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[#9EB5A5] transition hover:text-[#00C97B]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Network</p>
          <ul className="mt-3 space-y-2 text-sm">
            {contactLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer" className="text-[#9EB5A5] transition hover:text-[#00C97B]">
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-1 text-[#9EB5A5]">Contract: {`${deployedProofOfCreditAddress.slice(0, 10)}...${deployedProofOfCreditAddress.slice(-6)}`}</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
