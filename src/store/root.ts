import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { createProtocolDataSlice, ProtocolDataSlice } from './protocolDataSlice';

export type RootStore = ProtocolDataSlice;

export const useRootStore = create<RootStore>()(
  subscribeWithSelector(
    devtools((...args) => {
      return {
        ...createProtocolDataSlice(...args),
      };
    }),
  ),
);
