type AiRiskPanelProps = {
  creditScore: number;
  totalRepayments: number;
};

type RiskTier = "Low Risk" | "Medium Risk" | "High Risk";

type ConfidenceLevel = {
  label: number;
  widthClass: string;
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function getBaseTier(creditScore: number): RiskTier {
  if (creditScore < 30) return "High Risk";
  if (creditScore <= 70) return "Medium Risk";
  return "Low Risk";
}

function increaseRiskByOneLevel(tier: RiskTier): RiskTier {
  if (tier === "Low Risk") return "Medium Risk";
  if (tier === "Medium Risk") return "High Risk";
  return "High Risk";
}

function getRiskAssessment(creditScore: number, totalRepayments: number): {
  tier: RiskTier;
  explanation: string;
} {
  const baseTier = getBaseTier(creditScore);
  const adjustedTier = totalRepayments < 3 ? increaseRiskByOneLevel(baseTier) : baseTier;

  if (adjustedTier === "High Risk") {
    return {
      tier: adjustedTier,
      explanation:
        totalRepayments < 3
          ? "Limited repayment history and weak credit profile increase default risk exposure."
          : "Current credit profile indicates elevated repayment risk and requires strict lending limits.",
    };
  }

  if (adjustedTier === "Medium Risk") {
    return {
      tier: adjustedTier,
      explanation:
        totalRepayments < 3
          ? "Score is acceptable, but short repayment history warrants cautious underwriting."
          : "Borrower shows moderate stability with manageable risk under standard controls.",
    };
  }

  return {
    tier: adjustedTier,
    explanation: "Strong score and repayment performance indicate low expected credit risk.",
  };
}

function getConfidence(creditScore: number): ConfidenceLevel {
  const value = clamp(Math.round(35 + creditScore * 0.65), 40, 95);

  if (value < 56) {
    return { label: value, widthClass: "w-[45%]" };
  }
  if (value < 76) {
    return { label: value, widthClass: "w-[68%]" };
  }
  return { label: value, widthClass: "w-[88%]" };
}

export function AiRiskPanel({ creditScore, totalRepayments }: AiRiskPanelProps) {
  const assessment = getRiskAssessment(creditScore, totalRepayments);
  const confidence = getConfidence(creditScore);

  const badgeClassName =
    assessment.tier === "High Risk"
      ? "bg-rose-500/20 text-rose-200 border-rose-400/30"
      : assessment.tier === "Medium Risk"
        ? "bg-amber-500/20 text-amber-200 border-amber-400/30"
        : "bg-emerald-500/20 text-emerald-200 border-emerald-400/30";

  return (
    <section className="rounded-xl border border-[#1E3A2B] bg-[#0C1A14] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[#6B7F74]">AI Risk Panel</p>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${badgeClassName}`}>
          {assessment.tier}
        </span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-[#9EB5A5]">{assessment.explanation}</p>

      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-[#6B7F74]">
          <span>Confidence</span>
          <span>{confidence.label}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#13231A]">
          <div className={`h-full rounded-full bg-[#00C96B] ${confidence.widthClass}`} />
        </div>
      </div>
    </section>
  );
}
