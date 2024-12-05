import { StateCreator } from "zustand";
import { RootStore } from "./root";
import { CHAINIDLIST } from "@/smart-router/constants/chainIdList";

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
    currentChainId: CHAINIDLIST.LINEA_TESTNET, // TODO: 后续根据不同部署网络 动态切换这里值
  }
}