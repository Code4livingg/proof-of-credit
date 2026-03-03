import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/providers/web3-provider";

export const metadata: Metadata = {
  title: "ProofOfCredit | Regulated On-Chain Credit Infrastructure",
  description: "Institutional borrower scoring and repayment verification on Creditcoin CC3 Testnet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
