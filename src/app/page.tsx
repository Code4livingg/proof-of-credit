import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

const contractAddress = "0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6";

const trustItems = [
  "Built on Creditcoin CC3 Testnet",
  "Chain ID: 102031",
  `Smart Contract: ${contractAddress}`,
];

const solutionItems = [
  "On-chain repayment registry",
  "Lender-restricted scoring updates",
  "Transparent eligibility logic",
  "Programmatic AI risk analysis",
];

const mockCards = [
  { label: "Credit Score", value: "78", status: "Stabilized" },
  { label: "Repayments", value: "19", status: "Verified" },
  { label: "Eligibility", value: "Eligible", status: "Threshold Met" },
  { label: "AI Risk Panel", value: "Low Risk", status: "Confidence 88%" },
];

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero-radial mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-20 lg:pt-24">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9EB5A5]">ProofOfCredit Infrastructure</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#E6F5EC] md:text-5xl">
              On-Chain Credit Infrastructure for <span className="text-[#00FF88]">Regulated Lending</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#9EB5A5]">
              Transparent borrower scoring and verifiable repayment history secured on Creditcoin CC3
              Testnet.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl border border-[#00FF88] bg-[#00FF88] px-5 py-3 text-sm font-semibold text-[#03110B] transition hover:opacity-90"
              >
                Launch Dashboard
              </Link>
              <a
                href={`https://creditcoin-testnet.blockscout.com/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[#00A65A] bg-transparent px-5 py-3 text-sm font-semibold text-[#9EE7BF] transition hover:border-[#00FF88] hover:text-[#00FF88]"
              >
                View Smart Contract
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {mockCards.map((card, index) => (
              <div
                key={card.label}
                className={`float-card rounded-2xl border border-[#1E4A34] bg-[#0C1A14]/80 p-5 shadow-[0_0_28px_rgba(0,255,136,0.12)] backdrop-blur ${
                  index % 2 === 0 ? "float-slow" : "float-fast"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold text-[#00FF88]">{card.value}</p>
                <p className="mt-2 text-sm text-[#9EB5A5]">{card.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="grid gap-3 rounded-2xl border border-[#1F2D25] bg-[#0B1114] p-5">
            {trustItems.map((item) => (
              <div key={item} className="inline-flex w-fit rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2 text-sm text-[#9EB5A5]">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article className="rounded-2xl border border-[#24342B] bg-[#0B1114] p-7">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">Traditional Credit Systems</h2>
            <div className="my-4 h-px bg-[#00A65A]" />
            <ul className="space-y-3 text-sm text-[#9EB5A5]">
              <li>Centralized</li>
              <li>Opaque</li>
              <li>Difficult to audit</li>
              <li>Region locked</li>
            </ul>
          </article>

          <article className="rounded-2xl border border-[#264A38] bg-[#0B1114] p-7">
            <h2 className="text-2xl font-semibold text-[#E6F5EC]">ProofOfCredit Enables</h2>
            <div className="my-4 h-px bg-[#00A65A]" />
            <ul className="space-y-3 text-sm text-[#9EB5A5]">
              {solutionItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#00C96B]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#1F2D25] bg-[#0B1114] p-7">
            <h3 className="text-xl font-semibold text-[#E6F5EC]">Architecture</h3>
            <div className="mt-6 flex flex-col items-center gap-4 text-center">
              <div className="w-full max-w-sm rounded-xl border border-[#1D3F2E] bg-[#0C1A14] px-4 py-3 text-sm text-[#9EB5A5]">
                Frontend
              </div>
              <div className="h-10 w-px bg-[#00A65A] shadow-[0_0_18px_rgba(0,255,136,0.2)]" />
              <div className="w-full max-w-sm rounded-xl border border-[#1D3F2E] bg-[#0C1A14] px-4 py-3 text-sm text-[#9EB5A5]">
                Smart Contract
              </div>
              <div className="h-10 w-px bg-[#00A65A] shadow-[0_0_18px_rgba(0,255,136,0.2)]" />
              <div className="w-full max-w-sm rounded-xl border border-[#1D3F2E] bg-[#0C1A14] px-4 py-3 text-sm text-[#9EB5A5]">
                Creditcoin Network
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-20">
          <div className="rounded-2xl border border-[#2B6A4A] bg-[#0E271D] p-8">
            <h3 className="text-3xl font-semibold text-[#E6F5EC]">Start Building Transparent Credit Infrastructure</h3>
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex rounded-xl border border-[#00FF88] bg-[#00FF88] px-5 py-3 text-sm font-semibold text-[#03110B] transition hover:opacity-90"
              >
                Launch Dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
