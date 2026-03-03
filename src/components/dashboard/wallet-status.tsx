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
      <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Connection</p>
        <p className="mt-2 text-sm text-[#E6F5EC]">
          {isConnected && address ? `Connected: ${shortenAddress(address)}` : "Wallet not connected"}
        </p>
        <p className="mt-1 text-sm text-[#9EB5A5]">Network: {chain?.name ?? "Unknown"}</p>
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
              className="rounded-lg border border-[#00A965] bg-[#00A965]/15 px-4 py-2 text-sm font-medium text-[#CFFFE4] transition hover:border-[#00C97B] hover:bg-[#00C97B]/20 disabled:cursor-not-allowed disabled:opacity-60"
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
