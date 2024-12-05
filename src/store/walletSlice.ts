import { StateCreator } from 'zustand';
import { RootStore } from './root';

export interface WalletSlice {
  account: string;
  setAccount: (account: string | undefined) => void;
}

export const createWalletSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  WalletSlice
> = (set, get) => ({
  account: '',
  setAccount(account) {
    set({
      account: account || '',
    });
  },
});
