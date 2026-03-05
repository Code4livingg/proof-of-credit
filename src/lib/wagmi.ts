import { createConfig } from "wagmi";
import { injected, walletConnect } from "wagmi/connectors";
import { defineChain, fallback, http } from "viem";

const defaultCreditcoinRpcUrl = "https://rpc.cc3-testnet.creditcoin.network";
const primaryCreditcoinRpcUrl =
  process.env.NEXT_PUBLIC_CREDITCOIN_RPC ?? defaultCreditcoinRpcUrl;
const creditcoinRpcFallbacks = (process.env.NEXT_PUBLIC_CREDITCOIN_RPC_FALLBACKS ?? "")
  .split(",")
  .map((url) => url.trim())
  .filter(Boolean);
const creditcoinRpcUrls = Array.from(new Set([primaryCreditcoinRpcUrl, ...creditcoinRpcFallbacks]));
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
    default: { http: creditcoinRpcUrls },
    public: { http: creditcoinRpcUrls },
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
    [creditcoinTestnet.id]: fallback(
      creditcoinRpcUrls.map((url) =>
        http(url, {
          timeout: 25_000,
          retryCount: 3,
          retryDelay: 700,
        })
      )
    ),
  },
  ssr: true,
});
