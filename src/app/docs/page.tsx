import { SiteShell } from "@/components/layout/site-shell";

const docsItems = [
  "Borrowers self-register on-chain.",
  "Owner registers trusted lenders.",
  "Lenders record repayments with weighted scoring.",
  "Eligibility is deterministic and transparent (score >= 50).",
  "All updates are verifiable on Creditcoin CC3 Testnet.",
];

export default function DocsPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-[#1F2D25] bg-[#0B1114] p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#6B7F74]">Smart Contract</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#E6F5EC]">ProofOfCredit Protocol Notes</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#9EB5A5]">
            The protocol maintains borrower credit state on-chain through controlled lender updates and
            deterministic eligibility checks.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-[#9EB5A5]">
            {docsItems.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-[#00C96B]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </SiteShell>
  );
}
