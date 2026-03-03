import { getAddress, isAddress, type Abi } from "viem";
import proofOfCreditArtifact from "../../../artifacts/contracts/ProofOfCredit.sol/ProofOfCredit.json";

export const deployedProofOfCreditAddress =
  "0xb614D65d26076901Ff32Ca8DDb44EB9B3FB6A136" as const;

const contractAddressFromEnv = process.env.NEXT_PUBLIC_PROOF_OF_CREDIT_ADDRESS;
const defaultAddress = contractAddressFromEnv ?? deployedProofOfCreditAddress;

export const proofOfCreditAddress = isAddress(defaultAddress)
  ? getAddress(defaultAddress)
  : undefined;

// ABI is sourced directly from Hardhat artifacts to stay in sync after recompilation.
export const proofOfCreditAbi = proofOfCreditArtifact.abi as Abi;
