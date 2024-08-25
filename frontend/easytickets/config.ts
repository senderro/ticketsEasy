import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import {
  sepolia
} from 'wagmi/chains';

import { http, createConfig } from "wagmi"

export const config = getDefaultConfig({
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia],
    ssr: true, // If your dApp uses server side rendering (SSR)
    transports: {
      // [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  });



  declare module "wagmi" {
    interface Register {
      config: typeof config;
    }
  }