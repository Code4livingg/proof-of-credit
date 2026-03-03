import { SiteShell } from "@/components/layout/site-shell";

const expansionItems = [
  "Off-chain oracle integration for external underwriting signals.",
  "Privacy-preserving credit attestations using zero-knowledge proof systems.",
  "Multi-lender governance committee with policy vote controls.",
  "Cross-chain compatibility layer for shared credit identity portability.",
  "Mainnet migration with staged compliance and risk controls.",
];

const riskItems = [
  "Regulatory compliance differs by jurisdiction and lending product class.",
  "Lender collusion risk exists if governance controls are weak or centralized.",
  "Oracle-based extensions introduce trust and data integrity assumptions.",
  "CC3 testnet conditions differ from production-grade mainnet reliability.",
];

export default function ProtocolPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <section className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Protocol Overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-[#E6F5EC]">
              ProofOfCredit: Deterministic On-Chain Credit Infrastructure
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#9EB5A5]">
              ProofOfCredit is infrastructure for programmable credit operations. It provides on-chain
              repayment logging, governance-adjustable eligibility thresholds, lender-permissioned score
              updates, deterministic credit tier classification, and audit-friendly metadata hash anchoring.
              The protocol is positioned as a reusable credit state layer rather than a standalone consumer dApp.
            </p>
          </section>

          <section className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-8">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">Market Problem Framing</h2>
            <p className="mt-4 text-sm leading-relaxed text-[#9EB5A5]">
              Institutional credit markets remain fragmented across jurisdictions and underwriting systems.
              Traditional scoring models are typically centralized and opaque, creating onboarding friction for
              regulated lenders and reducing portability of credit identity across platforms. The absence of an
              interoperable on-chain credit state limits composability between lenders, risk engines, and capital
              allocators.
            </p>
          </section>

          <section className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-8">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">Architecture</h2>
            <div className="mt-6 flex flex-col items-center gap-3 text-center">
              {["Borrower Wallet", "Authorized Lender", "Smart Contract", "Creditcoin Network"].map((node, index, nodes) => (
                <div key={node} className="w-full max-w-md">
                  <div className="rounded-xl border border-[#1F4D37] bg-[#101A1F] px-4 py-3 text-sm text-[#9EB5A5]">
                    {node}
                  </div>
                  {index < nodes.length - 1 ? <div className="mx-auto my-2 h-8 w-px bg-[#00C97B]" /> : null}
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm text-[#9EB5A5]">
              State transitions are deterministic: each permitted repayment update mutates borrower state,
              eligibility, and tier outputs through explicit on-chain logic.
            </p>
          </section>

          <section className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-8">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">Governance Model</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#9EB5A5]">
              <li>Owner-adjustable eligibility threshold for policy calibration.</li>
              <li>Lender allowlisting to enforce permissioned score mutation rights.</li>
              <li>Deterministic eligibility logic with explicit threshold checks.</li>
              <li>Tier classification model (None / Bronze / Silver / Gold) for policy-aware segmentation.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-8">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">Expansion Path</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#9EB5A5]">
              {expansionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-8">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">Risk & Constraints</h2>
            <ul className="mt-4 space-y-3 text-sm text-[#9EB5A5]">
              {riskItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </SiteShell>
  );
}
