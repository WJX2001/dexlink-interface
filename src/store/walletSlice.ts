import { StateCreator } from 'zustand';
import { RootStore } from './root';
import { Address, zeroAddress } from 'viem';

export interface WalletSlice {
  account: Address;
  setAccount: (account:  Address | undefined) => void;
}

export const createWalletSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  WalletSlice
> = (set, get) => ({
  account: zeroAddress,
  setAccount(account) {
    set({
      account: account || zeroAddress,
    });
  },
});
