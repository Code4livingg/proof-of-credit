import Link from "next/link";
import { Logo } from "@/components/layout/logo";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/repayments", label: "Repayments" },
  { href: "/governance", label: "Governance" },
  { href: "/docs", label: "Docs" },
  { href: "/about", label: "About" },
  { href: "/login", label: "Login" },
];

export function Navbar() {
  return (
    <header className="border-b border-[#1A2B23] bg-[#05070A]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#9EB5A5] transition hover:text-[#00C97B]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
