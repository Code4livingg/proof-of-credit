"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletStatus() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Connection</p>
        <p className="mt-2 text-sm text-slate-200">
          {isConnected && address
            ? `Connected: ${shortenAddress(address)}`
            : "Wallet not connected"}
        </p>
        <p className="mt-1 text-sm text-slate-400">Network: {chain?.name ?? "Unknown"}</p>
      </div>

      {isConnected ? (
        <button
          type="button"
          onClick={() => disconnect()}
          className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/20"
        >
          Disconnect
        </button>
      ) : (
        <div className="flex flex-wrap gap-2">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              type="button"
              onClick={() => connect({ connector })}
              className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isPending}
            >
              {isPending ? "Connecting..." : `Connect ${connector.name}`}
            </button>
          ))}
        </div>
      )}

      {error ? <p className="text-sm text-rose-300">{error.message}</p> : null}
    </div>
  );
}
