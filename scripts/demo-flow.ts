import { network } from "hardhat";
import { getAddress, isAddress, keccak256, stringToHex } from "viem";

function line(message = "") {
  console.log(message);
}

function section(title: string) {
  line("\n============================================================");
  line(title);
  line("============================================================");
}

type TxLike = { wait(): Promise<unknown> };

type BorrowerView = {
  creditScore: bigint;
  totalRepayments: bigint;
  registered: boolean;
};


type ProofOfCreditHandle = {
  waitForDeployment(): Promise<unknown>;
  getAddress(): Promise<string>;
  registerBorrower(): Promise<TxLike>;
  owner(): Promise<string>;
  registerLender(lender: string): Promise<TxLike>;
  recordRepayment(borrowerAddr: string, metadataHash: string): Promise<TxLike>;
  getBorrower(borrowerAddr: string): Promise<BorrowerView>;
  getEligibility(borrowerAddr: string): Promise<boolean>;
  getCreditTier(borrowerAddr: string): Promise<bigint | number>;
  creditHistoryHashes(borrowerAddr: string, index: bigint): Promise<string>;
};

function tierToLabel(tier: bigint | number): string {
  const normalized = Number(tier);
  if (normalized === 3) return "Gold";
  if (normalized === 2) return "Silver";
  if (normalized === 1) return "Bronze";
  return "None";
}

async function main(): Promise<void> {
  const connection = await network.connect({ network: "creditcoinTestnet", chainType: "l1" });

  try {
    const { ethers, networkName } = connection;
    const [deployer] = await ethers.getSigners();

    section("ProofOfCredit Demo Flow");
    line(`Network:            ${networkName}`);
    line(`Deployer:           ${deployer.address}`);

    const contractFactory = await ethers.getContractFactory("ProofOfCredit");

    const cliAddress = process.argv.find((value) => isAddress(value));
    const envAddress = process.env.PROOF_OF_CREDIT_ADDRESS;
    const providedAddress = cliAddress ?? envAddress;

    let contract: ProofOfCreditHandle;

    if (providedAddress) {
      if (!isAddress(providedAddress)) {
        throw new Error(`Invalid contract address provided: ${providedAddress}`);
      }

      const checksummed = getAddress(providedAddress);
      contract = (await ethers.getContractAt("ProofOfCredit", checksummed)) as unknown as ProofOfCreditHandle;

      section("Attach Contract");
      line(`Attached:           ${checksummed}`);
    } else {
      section("Deploy Contract");

      const constructorInputs = contractFactory.interface.deploy.inputs;
      if (constructorInputs.length === 0) {
        contract = (await contractFactory.deploy()) as unknown as ProofOfCreditHandle;
      } else if (constructorInputs.length === 1) {
        const deployWithOwner = contractFactory.deploy.bind(contractFactory) as unknown as (
          owner: string
        ) => ReturnType<typeof contractFactory.deploy>;
        contract = (await deployWithOwner(deployer.address)) as unknown as ProofOfCreditHandle;
      } else {
        throw new Error("Unsupported constructor shape for ProofOfCredit");
      }

      await contract.waitForDeployment();
      line(`Deployed:           ${await contract.getAddress()}`);
    }

    section("Run Demo Actions");

    const registerBorrowerTx = await contract.registerBorrower();
    await registerBorrowerTx.wait();
    line("Borrower registered");

    const owner = await contract.owner();
    if (owner.toLowerCase() === deployer.address.toLowerCase()) {
      const registerLenderTx = await contract.registerLender(deployer.address);
      await registerLenderTx.wait();
      line("Lender registered (owner action)");
    } else {
      line("Skipped lender registration (deployer is not owner)");
    }

    for (let i = 1; i <= 5; i += 1) {
      const metadataHash = keccak256(stringToHex(`repayment-${i}`));
      const repaymentTx = await contract.recordRepayment(deployer.address, metadataHash);
      await repaymentTx.wait();
      line(`Repayment ${i}/5 recorded with metadata hash ${metadataHash}`);
    }

    const borrower = await contract.getBorrower(deployer.address);
    const eligibility = await contract.getEligibility(deployer.address);
    const tier = await contract.getCreditTier(deployer.address);

    const historyHashCount = Number(borrower.totalRepayments);

    section("Demo Result");
    line(`Final credit score: ${borrower.creditScore.toString()}`);
    line(`Total repayments:   ${borrower.totalRepayments.toString()}`);
    line(`Credit tier:        ${tierToLabel(tier)}`);
    line(`Eligibility:        ${eligibility ? "Eligible" : "Not Eligible"}`);
    line(`History hash count: ${historyHashCount}`);

    line("\nDemo completed successfully.");
  } finally {
    await connection.close();
  }
}

main().catch((error: unknown) => {
  section("Demo Failed");
  if (error instanceof Error) {
    line(`Error: ${error.message}`);
  } else {
    line("An unknown error occurred during demo flow.");
    console.error(error);
  }
  process.exitCode = 1;
});
