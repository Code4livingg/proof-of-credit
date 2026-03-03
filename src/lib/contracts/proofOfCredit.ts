import { getAddress, isAddress } from "viem";

const contractAddressFromEnv = process.env.NEXT_PUBLIC_PROOF_OF_CREDIT_ADDRESS;

export const proofOfCreditAddress =
  contractAddressFromEnv && isAddress(contractAddressFromEnv)
    ? getAddress(contractAddressFromEnv)
    : undefined;

export const proofOfCreditAbi = [
  {
    type: "function",
    name: "owner",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
  {
    type: "function",
    name: "registerBorrower",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "function",
    name: "registerLender",
    stateMutability: "nonpayable",
    inputs: [{ name: "lender", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "recordRepayment",
    stateMutability: "nonpayable",
    inputs: [{ name: "borrowerAddr", type: "address" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getBorrower",
    stateMutability: "view",
    inputs: [{ name: "borrowerAddr", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "creditScore", type: "uint256" },
          { name: "totalRepayments", type: "uint256" },
          { name: "registered", type: "bool" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getEligibility",
    stateMutability: "view",
    inputs: [{ name: "borrowerAddr", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;
