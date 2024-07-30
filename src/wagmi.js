import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, base, mainnet, optimism, polygon } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "90f079dc357f3b0a2500be0388582698",
  chains: [mainnet, polygon, optimism, arbitrum, base],
});
