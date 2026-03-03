import { network } from "hardhat";
import { getAddress, isAddress } from "viem";

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
  recordRepayment(borrowerAddr: string): Promise<TxLike>;
  getBorrower(borrowerAddr: string): Promise<BorrowerView>;
  getEligibility(borrowerAddr: string): Promise<boolean>;
};

async function main(): Promise<void> {
  const connection = await network.connect({ network: "creditcoinTestnet", chainType: "l1" });

  try {
    const { ethers, networkName } = connection;
    const [deployer] = await ethers.getSigners();

    section("ProofOfCredit Demo Flow");
    line(`Network:            ${networkName}`);
    line(`Deployer:           ${deployer.address}`);

    const contractFactory = await ethers.getContractFactory("ProofOfCredit");
    const deployUntyped = contractFactory.deploy as (...args: unknown[]) => ReturnType<
      typeof contractFactory.deploy
    >;

    const cliAddress = process.argv[2];
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
        contract = (await deployUntyped()) as unknown as ProofOfCreditHandle;
      } else if (constructorInputs.length === 1) {
        contract = (await deployUntyped(deployer.address)) as unknown as ProofOfCreditHandle;
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
      const repaymentTx = await contract.recordRepayment(deployer.address);
      await repaymentTx.wait();
      line(`Repayment ${i}/5 recorded`);
    }

    const borrower = await contract.getBorrower(deployer.address);
    const eligibility = await contract.getEligibility(deployer.address);

    section("Demo Result");
    line(`Final credit score: ${borrower.creditScore.toString()}`);
    line(`Total repayments:   ${borrower.totalRepayments.toString()}`);
    line(`Eligibility:        ${eligibility ? "Eligible" : "Not Eligible"}`);

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
