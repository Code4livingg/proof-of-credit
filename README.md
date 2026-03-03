# ProofOfCredit

## Deterministic On-Chain Credit Infrastructure

ProofOfCredit is a governance-adjustable, deterministic credit scoring protocol deployed on Creditcoin testnet.  

It provides an infrastructure layer for transparent, policy-aware, and audit-friendly lending ecosystems.

This project is built as a seed-stage protocol concept designed for institutional and decentralized credit networks.

---

## Executive Overview

Traditional credit systems are fragmented, opaque, and geographically siloed.  
There is no interoperable, transparent on-chain credit identity layer suitable for institutional integration.

ProofOfCredit introduces:

- On-chain repayment logging
- Deterministic scoring logic
- Governance-adjustable eligibility threshold
- Tier-based credit classification
- Audit-friendly metadata hash anchoring
- Lender-permissioned scoring updates

All logic is verifiable and deterministic.

---

## Market Problem

Global credit infrastructure suffers from:

- Cross-border fragmentation
- Opaque centralized scoring models
- Institutional onboarding friction
- Lack of interoperable on-chain credit identity
- High trust and compliance costs

Blockchain systems lack deterministic, governance-aware credit infrastructure suitable for real-world adoption.

---

## Protocol Solution

ProofOfCredit acts as an infrastructure layer:

Borrower Wallet  
→ Authorized Lender  
→ Smart Contract  
→ Creditcoin Network  

The protocol ensures:

- Only approved lenders can record repayments
- Credit scores update deterministically
- Eligibility is computed transparently
- Credit tiers are derived mathematically
- Repayment metadata is permanently anchored

---

## Technical Architecture

- Smart Contract: Solidity ^0.8.28
- Network: Creditcoin Testnet (Chain ID 102031)
- Frontend: Next.js + Wagmi
- Deployment: Hardhat + Vercel

### Core Smart Contract Features

### Governance Layer
- Owner-adjustable eligibility threshold
- Lender allowlisting
- Deterministic eligibility logic

### Deterministic Scoring
- +10 per repayment
- +5 bonus every 5 repayments
- Fully on-chain state

### Tier Classification
- Bronze (1–49)
- Silver (50–79)
- Gold (80+)

### Audit Hash Anchoring
Each repayment includes a metadata hash stored immutably on-chain.

---

## Deployment Details

Network: Creditcoin Testnet  
Contract Address:

0xb614D65d26076901Ff32Ca8DDb44EB9B3FB6A136

Frontend:

https://proof-of-credit.vercel.app

---

## Roadmap

Q1 – Testnet deployment and governance baseline  
Q2 – Risk engine expansion  
Q3 – Off-chain oracle integration  
Q4 – Mainnet migration  

Long-term goals include cross-chain interoperability and privacy-preserving credit proofs.

---

## Monetization Model

ProofOfCredit is designed for:

- Institutional API access
- Governance service layer
- Enterprise credit infrastructure integration
- Policy-based scoring frameworks

No speculative tokenomics are introduced at this stage.

---

## Risk & Constraints

We acknowledge:

- Regulatory variability across jurisdictions
- Potential lender collusion risks
- Oracle trust assumptions (future phase)
- Testnet economic limitations

The protocol is designed with responsible scaling in mind.

---

## Why Creditcoin

Creditcoin’s mission aligns directly with transparent, real-world credit infrastructure.

ProofOfCredit demonstrates how deterministic on-chain credit logic can be built, governed, and verified on Creditcoin.

---

## Demo

A structured 2-minute demo flow is included in:

demo-flow.md

---

## License

MIT
