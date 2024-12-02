import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  lineaSepolia
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID as string,
  chains: [
    lineaSepolia,
  ],
  ssr: true,
});