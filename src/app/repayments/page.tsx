import { SiteShell } from "@/components/layout/site-shell";

const history = [
  { borrower: "0x61...2CBe", amount: "1 repayment", date: "2026-03-03", status: "Confirmed" },
  { borrower: "0x9f...A310", amount: "1 repayment", date: "2026-03-02", status: "Confirmed" },
  { borrower: "0x41...88c1", amount: "1 repayment", date: "2026-03-01", status: "Confirmed" },
];

export default function RepaymentsPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#1A2B23] bg-[#101A1F] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Repayment Operations</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#E6F5EC]">Repayment Entry</h1>
        </header>

        <section className="mt-6 rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-6">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Borrower address (0x...)"
              className="rounded-lg border border-[#1F4D37] bg-[#0E1713] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00C97B]"
            />
            <button
              type="button"
              className="rounded-lg border border-[#00C97B] bg-[#00C97B] px-4 py-2 text-sm font-semibold text-[#08120D]"
            >
              Record Repayment
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-6">
          <h2 className="text-lg font-semibold text-[#E6F5EC]">Repayment History</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm text-[#9EB5A5]">
              <thead>
                <tr className="border-b border-[#1F2D25] text-xs uppercase tracking-[0.16em] text-[#6B7F74]">
                  <th className="px-2 py-3">Borrower</th>
                  <th className="px-2 py-3">Amount</th>
                  <th className="px-2 py-3">Date</th>
                  <th className="px-2 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={`${row.borrower}-${row.date}`} className="border-b border-[#142119]">
                    <td className="px-2 py-3">{row.borrower}</td>
                    <td className="px-2 py-3">{row.amount}</td>
                    <td className="px-2 py-3">{row.date}</td>
                    <td className="px-2 py-3 text-[#00C97B]">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
