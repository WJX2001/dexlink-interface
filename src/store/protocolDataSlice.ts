import { StateCreator } from "zustand";
import { RootStore } from "./root";
import { ChainId } from "@/smart-router/constants/chainIdList";
import { TMPNETWORK } from "@/ui-config/TokenList";

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
    currentChainId: TMPNETWORK, // TODO: 后续根据不同部署网络 动态切换这里值
  }
}