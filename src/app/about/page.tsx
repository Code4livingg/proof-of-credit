import { SiteShell } from "@/components/layout/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-[#1F2D25] bg-[#0B1114] p-8">
          <p className="text-xs uppercase tracking-[0.22em] text-[#6B7F74]">Infrastructure Overview</p>
          <h1 className="mt-3 text-3xl font-semibold text-[#E6F5EC]">Regulatory-grade Credit Infrastructure</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#9EB5A5]">
            ProofOfCredit is designed for institutional transparency: lender-gated scoring writes,
            deterministic eligibility, and auditable borrower repayment history anchored on Creditcoin.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#1D3F2E] bg-[#0C1A14] p-5">
              <h3 className="text-sm font-semibold text-[#E6F5EC]">Governance-ready</h3>
              <p className="mt-2 text-sm text-[#9EB5A5]">Explicit owner controls and lender allowlists.</p>
            </div>
            <div className="rounded-xl border border-[#1D3F2E] bg-[#0C1A14] p-5">
              <h3 className="text-sm font-semibold text-[#E6F5EC]">Auditable by default</h3>
              <p className="mt-2 text-sm text-[#9EB5A5]">Every repayment event is recorded on-chain.</p>
            </div>
            <div className="rounded-xl border border-[#1D3F2E] bg-[#0C1A14] p-5">
              <h3 className="text-sm font-semibold text-[#E6F5EC]">Computation compatible</h3>
              <p className="mt-2 text-sm text-[#9EB5A5]">Risk models can consume deterministic protocol state.</p>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
