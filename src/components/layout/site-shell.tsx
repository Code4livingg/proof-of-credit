import { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="min-h-screen bg-[#030507] text-[#E6F5EC]">
      <div className="grid-pattern min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  );
}
