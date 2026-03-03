import { createConfig, http } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { defineChain } from "viem";

const creditcoinRpcUrl =
  process.env.NEXT_PUBLIC_CREDITCOIN_RPC ?? "https://rpc.cc3-testnet.creditcoin.network";
const walletConnectProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const creditcoinTestnet = defineChain({
  id: 102031,
  name: "Creditcoin Testnet",
  nativeCurrency: {
    name: "Creditcoin",
    symbol: "CTC",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [creditcoinRpcUrl] },
    public: { http: [creditcoinRpcUrl] },
  },
  blockExplorers: {
    default: {
      name: "Creditcoin Explorer",
      url: "https://creditcoin-testnet.blockscout.com",
    },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [creditcoinTestnet],
  connectors: [
    injected(),
    ...(walletConnectProjectId
      ? [
          walletConnect({
            projectId: walletConnectProjectId,
            showQrModal: true,
          }),
        ]
      : []),
  ],
  transports: {
    [creditcoinTestnet.id]: http(),
  },
  ssr: true,
});
