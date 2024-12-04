import { StateCreator } from "zustand";
import { RootStore } from "./root";

export interface ProtocolDataSlice {
  currentChainId: number;
}


export const createProtocolDataSlice: StateCreator<
  RootStore,
  [['zustand/subscribeWithSelector', never], ['zustand/devtools', never]],
  [],
  ProtocolDataSlice
> = (set, get) => {
  return {
    currentChainId: 59141,
  }
}