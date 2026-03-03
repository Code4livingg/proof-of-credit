# ProofOfCredit

## Executive Overview
ProofOfCredit is a seed-stage protocol concept for deterministic, policy-aware, on-chain credit infrastructure. The protocol records repayment activity, enforces lender-gated score updates, and exposes transparent eligibility and tier outputs designed for institutional lending workflows.

## Market Problem
Institutional credit systems face structural fragmentation:
- Cross-border credit context is siloed across disconnected systems.
- Traditional models are often centralized and opaque to external counterparties.
- Underwriting integration introduces high onboarding overhead for regulated lenders.
- Interoperable on-chain credit identity is still limited in production use.

## Protocol Solution
ProofOfCredit introduces an on-chain state machine for credit operations:
- Borrowers register directly on-chain.
- Authorized lenders submit repayment updates.
- Score updates are deterministic and policy-constrained.
- Eligibility and tier logic are computed transparently from contract state.
- Metadata hash anchoring enables audit-friendly reconciliation with external records.

## Technical Architecture
Core components:
- Smart contract: governance controls, lender permissions, deterministic scoring, tiering, eligibility checks.
- Frontend control plane: wallet-connected dashboard, repayment operations, protocol state visibility.
- Network layer: Creditcoin CC3 testnet for execution, event logs, and immutable state history.

State flow:
1. Borrower registers
2. Owner authorizes lender
3. Lender records repayment + metadata hash
4. Contract updates score/tier/eligibility deterministically
5. Events and hash anchors form an auditable trail

## Governance Design
Protocol governance currently includes:
- Owner-managed lender allowlisting
- Governance-adjustable eligibility threshold
- Deterministic tier and eligibility computation
- Explicit event emission for policy and repayment state changes

This model is designed to evolve toward multi-party governance while retaining deterministic execution semantics.

## Deterministic Tiering Model
Credit tier outputs are defined on-chain:
- `None`: score = 0
- `Bronze`: score 1-49
- `Silver`: score 50-79
- `Gold`: score >= 80

Eligibility is threshold-based and owner-adjustable via governance controls.

## Audit Hash Anchoring
Each repayment operation includes a `bytes32` metadata hash anchor:
- Enables linkage to off-chain underwriting records without exposing sensitive raw payloads.
- Supports audit trails, compliance checks, and downstream risk model validation.

## Deployment Details
Current deployment target:
- Network: Creditcoin CC3 Testnet
- Chain ID: 102031
- Contract: `0xb614D65d26076901Ff32Ca8DDb44EB9B3FB6A136`

Environment variables:
- `PRIVATE_KEY`
- `CREDITCOIN_RPC`
- `NEXT_PUBLIC_PROOF_OF_CREDIT_ADDRESS`
- `NEXT_PUBLIC_CREDITCOIN_RPC`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## Roadmap
- Q1: Protocol deployment and baseline scoring logic
- Q2: Operations dashboard and governance controls
- Q3: Expanded risk engine and integration interfaces
- Q4: Mainnet readiness and institutional pilot pathways

## Monetization Model
ProofOfCredit is positioned as infrastructure software and service:
- Institutional API access for score, tier, and eligibility integrations
- Governance service layer for policy management and controls orchestration
- Enterprise deployment integrations for lender workflows and compliance tooling

No speculative tokenomics are required for this model.
