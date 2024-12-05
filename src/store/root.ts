import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import {
  createProtocolDataSlice,
  ProtocolDataSlice,
} from './protocolDataSlice';
import { createWalletSlice, WalletSlice } from './walletSlice';

export type RootStore = ProtocolDataSlice & WalletSlice;

export const useRootStore = create<RootStore>()(
  subscribeWithSelector(
    devtools((...args) => {
      return {
        ...createProtocolDataSlice(...args),
        ...createWalletSlice(...args),
      };
    }),
  ),
);
