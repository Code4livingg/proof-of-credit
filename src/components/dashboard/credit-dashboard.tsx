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

  const recordRepayment = (borrowerAddr: `0x${string}`) => {
    if (!startAction("Record Repayment")) return;
    writeContract(
      {
        address: proofOfCreditAddress!,
        abi: proofOfCreditAbi,
        functionName: "recordRepayment",
        args: [borrowerAddr],
      },
      { onError: handleWriteError }
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6">
        <header className="rounded-2xl border border-[#1F2D25] bg-[#101A1F] p-8 shadow-[0_0_28px_rgba(0,255,136,0.12)]">
          <p className="text-xs uppercase tracking-[0.24em] text-[#6B7F74]">ProofOfCredit</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#E6F5EC]">Credit Risk Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#9EB5A5]">
            Monitor borrower performance and submit regulated credit updates on Creditcoin CC3 Testnet.
          </p>
        </header>

        {!contractReady ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-200">
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
                <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Credit Score</p>
                  <p className="mt-2 text-2xl font-semibold text-[#00FF88]">{borrower.creditScore.toString()}</p>
                </div>
                <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Repayments</p>
                  <p className="mt-2 text-2xl font-semibold text-[#E6F5EC]">
                    {borrower.totalRepayments.toString()}
                  </p>
                </div>
                <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Eligibility</p>
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
              className="rounded-lg border border-[#00A65A] bg-[#00A65A]/15 px-4 py-2 text-sm font-medium text-[#CFFFE4] transition hover:border-[#00FF88] hover:bg-[#00FF88]/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="w-full rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00A65A]"
              />
              <button
                type="button"
                onClick={() => recordRepayment(borrowerAddress as `0x${string}`)}
                disabled={!isConnected || !contractReady || !isAddress(borrowerAddress) || busy}
                className="rounded-lg border border-[#2E4A3C] bg-[#12231B] px-4 py-2 text-sm font-medium text-[#E6F5EC] transition hover:border-[#00FF88] hover:text-[#00FF88] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="w-full rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00A65A]"
              />
              <button
                type="button"
                onClick={() => registerLender(lenderAddress as `0x${string}`)}
                disabled={!contractReady || !isAddress(lenderAddress) || busy}
                className="rounded-lg border border-[#00A65A] bg-[#00A65A]/15 px-4 py-2 text-sm font-medium text-[#CFFFE4] transition hover:border-[#00FF88] hover:bg-[#00FF88]/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && actionLabel === "Register Lender" ? "Submitting..." : "Register Lender"}
              </button>
            </div>
          </Card>
        ) : (
          <div className="rounded-2xl border border-[#1F2D25] bg-[#101A1F] p-4 text-sm text-[#9EB5A5]">
            Owner-only lender management is hidden for non-owner wallets.
          </div>
        )}

        {writeErrorMessage ? <p className="text-sm text-rose-300">{writeErrorMessage}</p> : null}
        {receiptQuery.error ? <p className="text-sm text-rose-300">{receiptQuery.error.message}</p> : null}
      </div>
    </main>
  );
}
