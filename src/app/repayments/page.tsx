"use client";

import { useMemo, useState } from "react";
import { isAddress, keccak256, stringToHex } from "viem";
import { useAccount, useChainId, usePublicClient, useWalletClient, useWriteContract } from "wagmi";
import { SiteShell } from "@/components/layout/site-shell";
import { proofOfCreditAbi, proofOfCreditAddress } from "@/lib/contracts/proofOfCredit";
import { creditcoinTestnet } from "@/lib/wagmi";

type TxStatus = "submitted" | "confirmed" | "failed";

type UiTx = {
  hash: `0x${string}`;
  status: TxStatus;
};

function txExplorerUrl(hash: string): string {
  return `https://creditcoin-testnet.blockscout.com/tx/${hash}`;
}

function applyGasBuffer(estimatedGas: bigint): bigint {
  return (estimatedGas * 12n) / 10n;
}

export default function RepaymentsPage() {
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [metadataInput, setMetadataInput] = useState("");
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const [writeErrorMessage, setWriteErrorMessage] = useState<string | null>(null);
  const [recentTxs, setRecentTxs] = useState<UiTx[]>([]);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { writeContractAsync, isPending } = useWriteContract();

  const expectedChainId = creditcoinTestnet.id;
  const contractReady = Boolean(proofOfCreditAddress);
  const signerReady = Boolean(walletClient?.account?.address);
  const networkMismatch = chainId !== expectedChainId;
  const metadataHashPreview = metadataInput ? keccak256(stringToHex(metadataInput)) : undefined;

  const busy = isPending;

  const canSubmit = useMemo(
    () =>
      isConnected &&
      signerReady &&
      contractReady &&
      !networkMismatch &&
      !busy &&
      isAddress(borrowerAddress) &&
      Boolean(metadataHashPreview),
    [isConnected, signerReady, contractReady, networkMismatch, busy, borrowerAddress, metadataHashPreview]
  );

  const upsertRecentTx = (nextTx: UiTx) => {
    setRecentTxs((prev) => {
      const withoutHash = prev.filter((tx) => tx.hash !== nextTx.hash);
      return [nextTx, ...withoutHash].slice(0, 8);
    });
  };

  const getFeeOverrides = async () => {
    const minGasPrice = 1_000_000_000n;

    try {
      const latestBlock = await publicClient!.getBlock({ blockTag: "latest" });
      if (latestBlock.baseFeePerGas !== null) {
        const fees = await publicClient!.estimateFeesPerGas();
        const priorityFee =
          fees.maxPriorityFeePerGas && fees.maxPriorityFeePerGas > 0n
            ? fees.maxPriorityFeePerGas
            : minGasPrice;
        const maxFee =
          fees.maxFeePerGas && fees.maxFeePerGas > 0n
            ? fees.maxFeePerGas
            : priorityFee * 2n;

        return {
          maxPriorityFeePerGas: priorityFee,
          maxFeePerGas: maxFee < priorityFee ? priorityFee : maxFee,
        };
      }
    } catch {
      // Fallback to legacy gas price below.
    }

    try {
      const gasPrice = await publicClient!.getGasPrice();
      return { gasPrice: gasPrice > 0n ? gasPrice : minGasPrice };
    } catch {
      return { gasPrice: minGasPrice };
    }
  };

  const trackReceiptInBackground = (hash: `0x${string}`) => {
    upsertRecentTx({ hash, status: "submitted" });

    void publicClient!
      .waitForTransactionReceipt({ hash, retryCount: 3, retryDelay: 1_000, timeout: 180_000 })
      .then((receipt) => {
        if (receipt.status === "success") {
          upsertRecentTx({ hash, status: "confirmed" });
          return;
        }

        upsertRecentTx({ hash, status: "failed" });
      })
      .catch(() => {
        upsertRecentTx({ hash, status: "submitted" });
      });
  };

  const recordRepayment = async () => {
    if (!proofOfCreditAddress) {
      setWriteErrorMessage("Contract address is not configured. Set NEXT_PUBLIC_PROOF_OF_CREDIT_ADDRESS.");
      return;
    }
    if (!publicClient) {
      setWriteErrorMessage("Public RPC client is not ready. Reconnect wallet and try again.");
      return;
    }
    if (!isConnected || !address || !signerReady) {
      setWriteErrorMessage("Wallet signer is not ready. Reconnect wallet and try again.");
      return;
    }
    if (networkMismatch) {
      setWriteErrorMessage(
        `Wallet network mismatch. Switch wallet to chain ID ${expectedChainId} before sending transactions.`
      );
      return;
    }
    if (!isAddress(borrowerAddress) || !metadataHashPreview) {
      setWriteErrorMessage("Enter a valid borrower address and repayment metadata.");
      return;
    }

    setActionLabel("Record Repayment");
    setWriteErrorMessage(null);

    try {
      const estimatedGas = await publicClient.estimateContractGas({
        address: proofOfCreditAddress,
        abi: proofOfCreditAbi,
        functionName: "recordRepayment",
        args: [borrowerAddress as `0x${string}`, metadataHashPreview],
        account: address,
      });
      const feeOverrides = await getFeeOverrides();

      const txHash = await writeContractAsync({
        address: proofOfCreditAddress,
        abi: proofOfCreditAbi,
        functionName: "recordRepayment",
        args: [borrowerAddress as `0x${string}`, metadataHashPreview],
        account: address,
        chainId: expectedChainId,
        gas: applyGasBuffer(estimatedGas),
        ...feeOverrides,
      });

      setActionLabel(null);
      trackReceiptInBackground(txHash);
    } catch (error) {
      setActionLabel(null);
      setWriteErrorMessage((error as Error).message);
    }
  };

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#1A2B23] bg-[#101A1F] p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">Repayment Operations</p>
          <h1 className="mt-2 text-3xl font-semibold text-[#E6F5EC]">Record Repayment</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#9EB5A5]">
            Submit lender repayment updates on-chain. Transactions are submitted immediately and confirmed in the
            background.
          </p>
        </header>

        {!contractReady ? (
          <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
            Set <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_PROOF_OF_CREDIT_ADDRESS</code> in your
            environment to enable repayment actions.
          </div>
        ) : null}

        <section className="mt-6 rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-6">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Borrower address (0x...)"
              value={borrowerAddress}
              onChange={(event) => setBorrowerAddress(event.target.value.trim())}
              className="w-full rounded-lg border border-[#1F4D37] bg-[#0E1713] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00C97B]"
            />
            <textarea
              placeholder="Repayment metadata text (hashed client-side)"
              value={metadataInput}
              onChange={(event) => setMetadataInput(event.target.value)}
              className="min-h-24 w-full rounded-lg border border-[#1F4D37] bg-[#0E1713] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00C97B]"
            />
            <p className="text-xs text-[#9EB5A5]">
              Metadata hash: {metadataHashPreview ?? "Enter metadata text to generate hash"}
            </p>
            <button
              type="button"
              onClick={() => void recordRepayment()}
              disabled={!canSubmit}
              className="rounded-lg border border-[#00C97B] bg-[#00C97B] px-4 py-2 text-sm font-semibold text-[#08120D] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && actionLabel === "Record Repayment" ? "Submitting..." : "Record Repayment"}
            </button>
          </div>
        </section>

        {networkMismatch ? (
          <p className="mt-6 text-sm text-amber-300">
            Wallet is on chain ID {chainId}. Switch to chain ID {expectedChainId} (Creditcoin Testnet) to submit
            transactions.
          </p>
        ) : null}

        {recentTxs.length > 0 ? (
          <section className="mt-6 rounded-2xl border border-[#1A2B23] bg-[#0B1114] p-6">
            <h2 className="text-lg font-semibold text-[#E6F5EC]">Transaction Activity</h2>
            <ul className="mt-4 space-y-2 text-sm text-[#9EB5A5]">
              {recentTxs.map((tx) => (
                <li key={tx.hash}>
                  <a href={txExplorerUrl(tx.hash)} target="_blank" rel="noreferrer" className="text-[#9EE4BF] underline">
                    {tx.status} - {tx.hash}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {writeErrorMessage ? <p className="mt-6 text-sm text-rose-300">{writeErrorMessage}</p> : null}
      </main>
    </SiteShell>
  );
}
