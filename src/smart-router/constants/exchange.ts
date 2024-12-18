import { ChainId } from './chainIdList';

type SmartRouterAddress = {
  [key:number]: string;
};

export const SMART_ROUTER_ADDRESS: SmartRouterAddress = {
  [ChainId.fuji]: '0x97E85b5066612DEaf2F0D9d4c3070FFF41dCA5A0',
};
