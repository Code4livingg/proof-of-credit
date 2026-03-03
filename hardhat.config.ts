import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";
import dotenv from "dotenv";

dotenv.config();

const creditcoinRpcUrl = process.env.CREDITCOIN_RPC ?? "http://127.0.0.1:8545";
const creditcoinPrivateKey = process.env.PRIVATE_KEY;

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
    // Warning: If CREDITCOIN_RPC or PRIVATE_KEY is missing, this network stays compile-safe.
    // It falls back to localhost RPC and an empty accounts list, so builds do not crash.
    creditcoinTestnet: {
      type: "http",
      chainType: "l1",
      url: creditcoinRpcUrl,
      accounts: creditcoinPrivateKey ? [creditcoinPrivateKey] : [],
      chainId: 102031,
    },
  },
});
