'use client';
import { config } from "../../config";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';



const queryClient = new QueryClient()

export function Providers({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>){
    return <WagmiProvider config={config}>


         <QueryClientProvider client={queryClient}>
         <RainbowKitProvider>


                    {children}


        </RainbowKitProvider>
        </QueryClientProvider>
        </WagmiProvider>
}