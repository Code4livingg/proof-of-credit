import { network } from "hardhat";
import type { Contract } from "ethers";

async function main(): Promise<void> {
  const connection = await network.connect();

  try {
    const { ethers, networkName } = connection;
    const [deployer] = await ethers.getSigners();

    const proofOfCreditFactory = await ethers.getContractFactory("ProofOfCredit");
    const constructorInputs = proofOfCreditFactory.interface.deploy.inputs;

    let proofOfCredit: Contract;
    let deployedProofOfCredit;
    if (constructorInputs.length === 0) {
      deployedProofOfCredit = await proofOfCreditFactory.deploy();
    } else if (constructorInputs.length === 1) {
      // Supports constructor(address initialOwner) style contracts.
      const deployWithOwner = proofOfCreditFactory.deploy.bind(proofOfCreditFactory) as (
        owner: string
      ) => ReturnType<typeof proofOfCreditFactory.deploy>;
      deployedProofOfCredit = await deployWithOwner(deployer.address);
    } else {
      throw new Error("Unsupported ProofOfCredit constructor: expected 0 or 1 argument");
    }

    await deployedProofOfCredit.waitForDeployment();
    const contractAddress = await deployedProofOfCredit.getAddress();
    proofOfCredit = new ethers.Contract(contractAddress, proofOfCreditFactory.interface, deployer);

    console.log(`Network name: ${networkName}`);
    console.log(`Deployer address: ${deployer.address}`);
    console.log(`Contract address: ${await proofOfCredit.getAddress()}`);
  } finally {
    await connection.close();
  }
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(`Deployment failed: ${error.message}`);
  } else {
    console.error("Deployment failed with a non-Error exception", error);
  }

  process.exitCode = 1;
});
