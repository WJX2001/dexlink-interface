import { getDefaultConfig } from '@rainbow-me/rainbowkit';
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