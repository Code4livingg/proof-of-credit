"use client";

import { useEffect, useMemo, useState } from "react";
import { isAddress } from "viem";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { proofOfCreditAbi, proofOfCreditAddress } from "@/lib/contracts/proofOfCredit";
import { Card } from "@/components/ui/card";
import { WalletStatus } from "@/components/dashboard/wallet-status";
import { AiRiskPanel } from "@/components/dashboard/ai-risk-panel";

type BorrowerData = {
  creditScore: bigint;
  totalRepayments: bigint;
  registered: boolean;
};

const defaultBorrower: BorrowerData = {
  creditScore: 0n,
  totalRepayments: 0n,
  registered: false,
};

export function CreditDashboard() {
  const [lenderAddress, setLenderAddress] = useState("");
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const [writeErrorMessage, setWriteErrorMessage] = useState<string | null>(null);

  const { address, isConnected } = useAccount();

  const contractReady = Boolean(proofOfCreditAddress);

  const ownerQuery = useReadContract({
    address: proofOfCreditAddress,
    abi: proofOfCreditAbi,
    functionName: "owner",
    query: { enabled: contractReady },
  });

  const borrowerQuery = useReadContract({
    address: proofOfCreditAddress,
    abi: proofOfCreditAbi,
    functionName: "getBorrower",
    args: address ? [address] : undefined,
    query: { enabled: contractReady && Boolean(address) },
  });

  const eligibilityQuery = useReadContract({
    address: proofOfCreditAddress,
    abi: proofOfCreditAbi,
    functionName: "getEligibility",
    args: address ? [address] : undefined,
    query: { enabled: contractReady && Boolean(address) },
  });

  const { data: txHash, writeContract, isPending: isSubmitting } = useWriteContract();
  const receiptQuery = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (receiptQuery.isSuccess) {
      void ownerQuery.refetch();
      void borrowerQuery.refetch();
      void eligibilityQuery.refetch();
      setActionLabel(null);
    }
  }, [receiptQuery.isSuccess]);

  const ownerAddress = ownerQuery.data;
  const isOwner = useMemo(() => {
    if (!ownerAddress || !address) return false;
    return ownerAddress.toLowerCase() === address.toLowerCase();
  }, [ownerAddress, address]);

  const borrower = (borrowerQuery.data as BorrowerData | undefined) ?? defaultBorrower;
  const isEligible = Boolean(eligibilityQuery.data);

  const busy = isSubmitting || receiptQuery.isLoading;

  const startAction = (label: string) => {
    if (!proofOfCreditAddress) return;
    setWriteErrorMessage(null);
    setActionLabel(label);
    return true;
  };

  const handleWriteError = (error: Error) => {
    setActionLabel(null);
    setWriteErrorMessage(error.message);
  };

  const registerBorrower = () => {
    if (!startAction("Register Borrower")) return;
    writeContract(
      {
        address: proofOfCreditAddress!,
        abi: proofOfCreditAbi,
        functionName: "registerBorrower",
      },
      { onError: handleWriteError }
    );
  };

  const registerLender = (lender: `0x${string}`) => {
    if (!startAction("Register Lender")) return;
    writeContract(
      {
        address: proofOfCreditAddress!,
        abi: proofOfCreditAbi,
        functionName: "registerLender",
        args: [lender],
      },
      { onError: handleWriteError }
    );
  };

  const recordRepayment = (borrower: `0x${string}`) => {
    if (!startAction("Record Repayment")) return;
    writeContract(
      {
        address: proofOfCreditAddress!,
        abi: proofOfCreditAbi,
        functionName: "recordRepayment",
        args: [borrower],
      },
      { onError: handleWriteError }
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#172554_0%,_#020617_40%,_#020617_100%)] px-4 py-10 text-slate-100">
      <div className="mx-auto grid w-full max-w-6xl gap-6">
        <header className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/80 to-slate-800/40 p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Proof of Credit</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-100">
            Credit Risk Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Monitor borrower performance and submit regulated credit updates on Creditcoin Testnet.
          </p>
        </header>

        {!contractReady ? (
          <div className="rounded-2xl border border-amber-300/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            Set <code className="rounded bg-black/30 px-1">NEXT_PUBLIC_PROOF_OF_CREDIT_ADDRESS</code> in
            your environment to enable dashboard actions.
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Wallet" subtitle="Connect and verify active network">
            <WalletStatus />
          </Card>

          <Card title="Borrower Profile" subtitle="Live score state for connected wallet">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Credit Score</p>
                  <p className="mt-2 text-2xl font-semibold text-cyan-300">{borrower.creditScore.toString()}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Repayments</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-100">
                    {borrower.totalRepayments.toString()}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">Eligibility</p>
                  <span
                    className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      isEligible ? "bg-emerald-500/20 text-emerald-200" : "bg-rose-500/20 text-rose-200"
                    }`}
                  >
                    {isEligible ? "Eligible" : "Not Eligible"}
                  </span>
                </div>
              </div>

              <AiRiskPanel
                creditScore={Number(borrower.creditScore)}
                totalRepayments={Number(borrower.totalRepayments)}
              />
            </div>
          </Card>

          <Card title="Borrower Action" subtitle="Enroll connected wallet as borrower">
            <button
              type="button"
              onClick={registerBorrower}
              disabled={!isConnected || !contractReady || busy}
              className="rounded-lg border border-cyan-300/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && actionLabel === "Register Borrower" ? "Submitting..." : "Register Borrower"}
            </button>
          </Card>

          <Card title="Repayment Entry" subtitle="Lenders can update borrower repayment history">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Borrower address (0x...)"
                value={borrowerAddress}
                onChange={(event) => setBorrowerAddress(event.target.value.trim())}
                className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
              />
              <button
                type="button"
                onClick={() => recordRepayment(borrowerAddress as `0x${string}`)}
                disabled={!isConnected || !contractReady || !isAddress(borrowerAddress) || busy}
                className="rounded-lg border border-slate-300/30 bg-white/5 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && actionLabel === "Record Repayment" ? "Submitting..." : "Record Repayment"}
              </button>
            </div>
          </Card>
        </div>

        {isOwner ? (
          <Card title="Owner Controls" subtitle="Register authorized lender accounts">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Lender address (0x...)"
                value={lenderAddress}
                onChange={(event) => setLenderAddress(event.target.value.trim())}
                className="w-full rounded-lg border border-white/15 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-300 transition focus:ring-2"
              />
              <button
                type="button"
                onClick={() => registerLender(lenderAddress as `0x${string}`)}
                disabled={!contractReady || !isAddress(lenderAddress) || busy}
                className="rounded-lg border border-emerald-300/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-100 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && actionLabel === "Register Lender" ? "Submitting..." : "Register Lender"}
              </button>
            </div>
          </Card>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-400">
            Owner-only lender management is hidden for non-owner wallets.
          </div>
        )}

        {writeErrorMessage ? <p className="text-sm text-rose-300">{writeErrorMessage}</p> : null}
        {receiptQuery.error ? <p className="text-sm text-rose-300">{receiptQuery.error.message}</p> : null}
      </div>
    </main>
  );
}
