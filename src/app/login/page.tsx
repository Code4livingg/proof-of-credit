import { SiteShell } from "@/components/layout/site-shell";

export default function LoginPage() {
  return (
    <SiteShell>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-2xl border border-[#1A2B23] bg-[#101A1F] p-8 shadow-[0_0_24px_rgba(0,201,123,0.14)]">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Secure Access</p>
          <h1 className="mt-3 text-2xl font-semibold text-[#E6F5EC]">Institutional Login</h1>
          <p className="mt-3 text-sm text-[#9EB5A5]">
            Connect your wallet to access governance-grade credit infrastructure tools.
          </p>
          <button
            type="button"
            className="mt-6 w-full rounded-xl border border-[#00C97B] bg-[#00C97B] px-4 py-3 text-sm font-semibold text-[#08120D] transition hover:opacity-90"
          >
            Connect Wallet
          </button>
        </section>
      </main>
    </SiteShell>
  );
}
