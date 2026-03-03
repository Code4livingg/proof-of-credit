import { network } from "hardhat";

async function main(): Promise<void> {
  const connection = await network.connect({ network: "creditcoinTestnet", chainType: "l1" });
  try {
    const { ethers } = connection;
    const [deployer] = await ethers.getSigners();
    console.log(deployer.address);
  } finally {
    await connection.close();
  }
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});
