import { CHAINS } from '@/config/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import memoize from 'lodash/memoize'
import {
  avalancheFuji
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [
    avalancheFuji,
  ],
  ssr: true,
});


export const chains = CHAINS

export const CHAIN_IDS = chains.map((c) => c.id)
export const isChainSupported = memoize((chainId: number) => (CHAIN_IDS as number[]).includes(chainId))