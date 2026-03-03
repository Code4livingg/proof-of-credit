"use client";

import { useEffect, useMemo, useState } from "react";
import { isAddress, keccak256, parseAbiItem, stringToHex } from "viem";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import {
  deployedProofOfCreditAddress,
  proofOfCreditAbi,
  proofOfCreditAddress,
} from "@/lib/contracts/proofOfCredit";
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

const tierLabels = ["None", "Bronze", "Silver", "Gold"] as const;

function getTierBadgeClass(tier: string): string {
  if (tier === "Gold") return "bg-emerald-500/20 text-emerald-200";
  if (tier === "Silver") return "bg-slate-500/20 text-slate-200";
  if (tier === "Bronze") return "bg-amber-500/20 text-amber-200";
  return "bg-zinc-500/20 text-zinc-200";
}

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function txExplorerUrl(hash: string): string {
  return `https://creditcoin-testnet.blockscout.com/tx/${hash}`;
}

export function CreditDashboard() {
  const [lenderAddress, setLenderAddress] = useState("");
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [metadataInput, setMetadataInput] = useState("");
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const [writeErrorMessage, setWriteErrorMessage] = useState<string | null>(null);
  const [recentRepaymentTxs, setRecentRepaymentTxs] = useState<string[]>([]);
  const [lenderCount, setLenderCount] = useState<number>(0);

  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();

  const contractReady = Boolean(proofOfCreditAddress);

  const ownerQuery = useReadContract({
    address: proofOfCreditAddress,
    abi: proofOfCreditAbi,
    functionName: "owner",
    query: { enabled: contractReady },
  });

  const eligibilityThresholdQuery = useReadContract({
    address: proofOfCreditAddress,
    abi: proofOfCreditAbi,
    functionName: "eligibilityThreshold",
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

  const tierQuery = useReadContract({
    address: proofOfCreditAddress,
    abi: proofOfCreditAbi,
    functionName: "getCreditTier",
    args: address ? [address] : undefined,
    query: { enabled: contractReady && Boolean(address) },
  });

  const { data: txHash, writeContract, isPending: isSubmitting } = useWriteContract();
  const receiptQuery = useWaitForTransactionReceipt({ hash: txHash });

  const ownerAddress = ownerQuery.data as string | undefined;
  const isOwner = useMemo(() => {
    if (!ownerAddress || !address) return false;
    return ownerAddress.toLowerCase() === address.toLowerCase();
  }, [ownerAddress, address]);

  const borrower = (borrowerQuery.data as BorrowerData | undefined) ?? defaultBorrower;
  const isEligible = Boolean(eligibilityQuery.data);
  const eligibilityThreshold = Number(eligibilityThresholdQuery.data ?? 0n);

  const tierIndex = Number(tierQuery.data ?? 0);
  const tier = tierLabels[tierIndex] ?? "None";

  const historyCount = Number(borrower.totalRepayments);
  const historyContracts = useMemo(() => {
    if (!contractReady || !address || historyCount <= 0) {
      return [];
    }

    return Array.from({ length: historyCount }, (_, index) => ({
      address: proofOfCreditAddress!,
      abi: proofOfCreditAbi,
      functionName: "creditHistoryHashes",
      args: [address, BigInt(index)],
    }));
  }, [address, contractReady, historyCount]);

  const historyQuery = useReadContracts({
    contracts: historyContracts,
    query: { enabled: historyContracts.length > 0 },
  });

  const historyHashes =
    historyQuery.data
      ?.map((entry) => (entry.status === "success" ? String(entry.result) : null))
      .filter((value): value is string => Boolean(value))
      .reverse() ?? [];

  const metadataHashPreview = metadataInput ? keccak256(stringToHex(metadataInput)) : undefined;

  useEffect(() => {
    const loadLenderCount = async () => {
      if (!publicClient || !proofOfCreditAddress) {
        setLenderCount(0);
        return;
      }

      const event = parseAbiItem("event LenderRegistered(address indexed lender)");
      const logs = await publicClient.getLogs({
        address: proofOfCreditAddress,
        event,
        fromBlock: 0n,
        toBlock: "latest",
      });

      setLenderCount(logs.length);
    };

    void loadLenderCount();
  }, [publicClient, receiptQuery.isSuccess]);

  useEffect(() => {
    if (receiptQuery.isSuccess) {
      void ownerQuery.refetch();
      void borrowerQuery.refetch();
      void eligibilityQuery.refetch();
      void tierQuery.refetch();
      void historyQuery.refetch();
      void eligibilityThresholdQuery.refetch();
      setActionLabel(null);
    }
  }, [
    borrowerQuery,
    eligibilityQuery,
    eligibilityThresholdQuery,
    historyQuery,
    ownerQuery,
    receiptQuery.isSuccess,
    tierQuery,
  ]);

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

  const recordRepayment = (borrowerAddr: `0x${string}`, metadataHash: `0x${string}`) => {
    if (!startAction("Record Repayment")) return;
    writeContract(
      {
        address: proofOfCreditAddress!,
        abi: proofOfCreditAbi,
        functionName: "recordRepayment",
        args: [borrowerAddr, metadataHash],
      },
      {
        onError: handleWriteError,
        onSuccess: (hash) => {
          setRecentRepaymentTxs((prev) => [hash, ...prev].slice(0, 5));
        },
      }
    );
  };

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-6">
        <header className="rounded-2xl border border-[#1F2D25] bg-[#101A1F] p-8 shadow-[0_0_28px_rgba(0,201,123,0.12)]">
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

        <Card title="Protocol State" subtitle="Live protocol configuration and deployment context">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
              <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Eligibility Threshold</p>
              <p className="mt-2 text-xl font-semibold text-[#E6F5EC]">{eligibilityThreshold}</p>
            </div>
            <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
              <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Owner</p>
              <p className="mt-2 text-sm font-medium text-[#E6F5EC]">{ownerAddress ? shortenAddress(ownerAddress) : "-"}</p>
            </div>
            <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
              <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Total Lenders</p>
              <p className="mt-2 text-xl font-semibold text-[#E6F5EC]">{lenderCount}</p>
            </div>
            <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
              <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Contract</p>
              <p className="mt-2 text-sm font-medium text-[#E6F5EC]">{shortenAddress(deployedProofOfCreditAddress)}</p>
            </div>
            <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
              <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Chain ID</p>
              <p className="mt-2 text-xl font-semibold text-[#E6F5EC]">{chainId}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Wallet" subtitle="Connect and verify active network">
            <WalletStatus />
          </Card>

          <Card title="Borrower Profile" subtitle="Live score state for connected wallet">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Credit Score</p>
                  <p className="mt-2 text-2xl font-semibold text-[#00C97B]">{borrower.creditScore.toString()}</p>
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
                <div className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
                  <p className="text-xs uppercase tracking-wider text-[#6B7F74]">Credit Tier</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium ${getTierBadgeClass(tier)}`}>
                    {tier}
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
              className="rounded-lg border border-[#00A965] bg-[#00A965]/15 px-4 py-2 text-sm font-medium text-[#CFFFE4] transition hover:border-[#00C97B] hover:bg-[#00C97B]/20 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="w-full rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00A965]"
              />
              <textarea
                placeholder="Repayment metadata text (hashed client-side)"
                value={metadataInput}
                onChange={(event) => setMetadataInput(event.target.value)}
                className="min-h-24 w-full rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00A965]"
              />
              <p className="text-xs text-[#9EB5A5]">
                Metadata hash: {metadataHashPreview ?? "Enter metadata text to generate hash"}
              </p>
              <button
                type="button"
                onClick={() => recordRepayment(borrowerAddress as `0x${string}`, metadataHashPreview as `0x${string}`)}
                disabled={!isConnected || !contractReady || !isAddress(borrowerAddress) || !metadataHashPreview || busy}
                className="rounded-lg border border-[#2E4A3C] bg-[#12231B] px-4 py-2 text-sm font-medium text-[#E6F5EC] transition hover:border-[#00C97B] hover:text-[#00C97B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy && actionLabel === "Record Repayment" ? "Submitting..." : "Record Repayment"}
              </button>

              {recentRepaymentTxs.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {recentRepaymentTxs.map((hash) => (
                    <a
                      key={hash}
                      href={txExplorerUrl(hash)}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-xs text-[#9EE4BF] underline underline-offset-2 hover:text-[#00C97B]"
                    >
                      View Transaction on Explorer
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <Card title="Credit History Anchors" subtitle="On-chain metadata hash timeline for connected borrower">
          {historyHashes.length > 0 ? (
            <ul className="space-y-2 text-sm text-[#9EB5A5]">
              {historyHashes.map((hash, index) => (
                <li key={`${hash}-${index}`} className="rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2">
                  {hash}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#9EB5A5]">No repayment hashes recorded yet for this wallet.</p>
          )}
        </Card>

        {isOwner ? (
          <Card title="Owner Controls" subtitle="Register authorized lender accounts">
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Lender address (0x...)"
                value={lenderAddress}
                onChange={(event) => setLenderAddress(event.target.value.trim())}
                className="w-full rounded-lg border border-[#1E3A2B] bg-[#0C1A14] px-3 py-2 text-sm text-[#E6F5EC] outline-none transition focus:border-[#00A965]"
              />
              <button
                type="button"
                onClick={() => registerLender(lenderAddress as `0x${string}`)}
                disabled={!contractReady || !isAddress(lenderAddress) || busy}
                className="rounded-lg border border-[#00A965] bg-[#00A965]/15 px-4 py-2 text-sm font-medium text-[#CFFFE4] transition hover:border-[#00C97B] hover:bg-[#00C97B]/20 disabled:cursor-not-allowed disabled:opacity-50"
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
