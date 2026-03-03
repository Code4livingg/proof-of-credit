import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";

const contractAddress = "0xB99b7B14f8EDC5cEF7eDBbd51aA42588D831def6";

const statCards = [
  { label: "Credit Score", value: "74", note: "Deterministic output" },
  { label: "Repayments", value: "26", note: "On-chain verified" },
  { label: "Eligibility", value: "Eligible", note: "Rule-based decision" },
  { label: "AI Risk Panel", value: "Medium", note: "Confidence 81%" },
];

const comparison = [
  {
    title: "Traditional",
    points: ["Centralized underwriters", "Opaque scoring", "Region-locked data", "Hard to audit"],
  },
  {
    title: "ProofOfCredit",
    points: [
      "On-chain repayment history",
      "Deterministic eligibility checks",
      "Lender-gated updates",
      "Verifiable protocol state",
    ],
  },
];

const governanceCards = [
  "Lender allowlists",
  "Permissioned scoring updates",
  "Adjustable eligibility thresholds",
  "Deterministic risk logic",
];

const securityPoints = [
  "Immutable records",
  "Transparent eligibility",
  "Audit-friendly architecture",
  "No off-chain manipulation",
];

const useCases = ["Digital banks", "Microfinance", "Cross-border lending", "DAO credit markets"];

const roadmap = [
  { phase: "Q1", title: "Deployment" },
  { phase: "Q2", title: "Dashboard" },
  { phase: "Q3", title: "Risk Engine" },
  { phase: "Q4", title: "Mainnet" },
];

export default function Home() {
  return (
    <SiteShell>
      <main>
        <section className="hero-radial mx-auto grid w-full max-w-7xl gap-10 px-4 pb-16 pt-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:pb-24 lg:pt-24">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.24em] text-[#9EB5A5]">ProofOfCredit Protocol</p>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-[#E6F5EC] md:text-5xl">
              Regulatory-Grade On-Chain Credit Infrastructure
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-[#9EB5A5]">
              Deterministic borrower scoring, lender-gated updates, and verifiable repayment history
              secured on Creditcoin CC3.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-xl border border-[#00C97B] bg-[#00C97B] px-5 py-3 text-sm font-semibold text-[#08120D] transition hover:opacity-90"
              >
                Launch Dashboard
              </Link>
              <a
                href={`https://creditcoin-testnet.blockscout.com/address/${contractAddress}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[#1F5B40] px-5 py-3 text-sm font-semibold text-[#9EE4BF] transition hover:border-[#00C97B] hover:text-[#00C97B]"
              >
                View Smart Contract
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {statCards.map((card, index) => (
              <article
                key={card.label}
                className={`float-card rounded-2xl border border-[#204434] bg-[#101A1F]/85 p-5 shadow-[0_0_24px_rgba(0,201,123,0.14)] backdrop-blur ${
                  index % 2 === 0 ? "float-slow" : "float-fast"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">{card.label}</p>
                <p className="mt-3 text-2xl font-semibold text-[#00C97B]">{card.value}</p>
                <p className="mt-2 text-sm text-[#9EB5A5]">{card.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-5">
            {["Built on Creditcoin CC3 Testnet", "Chain ID: 102031", `Contract: ${contractAddress}`].map((item) => (
              <span key={item} className="rounded-lg border border-[#1F4D37] bg-[#0E1713] px-3 py-2 text-sm text-[#9EB5A5]">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#E6F5EC]">Traditional Credit Systems Are Broken</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {comparison.map((col) => (
              <article key={col.title} className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-7">
                <h3 className="text-xl font-semibold text-[#E6F5EC]">{col.title}</h3>
                <ul className="mt-4 space-y-3 text-sm text-[#9EB5A5]">
                  {col.points.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[#00C97B]" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-7">
            <h2 className="text-3xl font-semibold text-[#E6F5EC]">How It Works</h2>
            <div className="mt-7 flex flex-col items-center gap-4 text-center">
              {[
                "Wallet",
                "Smart Contract",
                "Score Update",
                "Eligibility Engine",
                "Immutable On-Chain Record",
              ].map((step, index, arr) => (
                <div key={step} className="w-full max-w-md">
                  <div className="rounded-xl border border-[#1F4D37] bg-[#0E1713] px-4 py-3 text-sm text-[#9EB5A5]">{step}</div>
                  {index < arr.length - 1 ? (
                    <div className="mx-auto my-2 h-8 w-px bg-[#00A965] shadow-[0_0_15px_rgba(0,201,123,0.22)]" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#E6F5EC]">Lender Governance Controls</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {governanceCards.map((item) => (
              <article key={item} className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-5">
                <p className="text-sm font-medium text-[#9EB5A5]">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-7">
            <h2 className="text-3xl font-semibold text-[#E6F5EC]">Security & Compliance</h2>
            <ul className="mt-5 grid gap-3 text-sm text-[#9EB5A5] sm:grid-cols-2">
              {securityPoints.map((point) => (
                <li key={point} className="rounded-lg border border-[#1F4D37] bg-[#0E1713] px-4 py-3">
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-[#E6F5EC]">Use Cases</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {useCases.map((useCase) => (
              <article key={useCase} className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-5 text-sm text-[#9EB5A5]">
                {useCase}
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-7">
            <h2 className="text-3xl font-semibold text-[#E6F5EC]">Roadmap</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              {roadmap.map((item) => (
                <article key={item.phase} className="rounded-xl border border-[#1F4D37] bg-[#0E1713] p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">{item.phase}</p>
                  <p className="mt-2 text-sm font-medium text-[#9EB5A5]">{item.title}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
