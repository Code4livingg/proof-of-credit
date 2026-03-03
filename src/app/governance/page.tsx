import { SiteShell } from "@/components/layout/site-shell";

const panels = [
  { title: "Lender Allowlists", body: "Add and revoke lender addresses with explicit owner controls." },
  { title: "Permission Policies", body: "Constrain score updates to authorized lenders only." },
  { title: "Eligibility Thresholds", body: "Review and tune policy thresholds for lender programs." },
  { title: "Audit Trail", body: "Track governance actions with immutable event records." },
];

export default function GovernancePage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#1A2B23] bg-[#101A1F] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Governance</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#E6F5EC]">Lender Permissions Panel</h1>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {panels.map((panel) => (
            <article key={panel.title} className="rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-6">
              <h2 className="text-lg font-semibold text-[#E6F5EC]">{panel.title}</h2>
              <p className="mt-3 text-sm text-[#9EB5A5]">{panel.body}</p>
            </article>
          ))}
        </section>
      </main>
    </SiteShell>
  );
}
