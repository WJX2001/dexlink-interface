import { useChainId } from 'wagmi';
import { useContract } from './useContract';
import { SMART_ROUTER_ADDRESS } from '@/smart-router/constants/exchange';
import ROUTERABI from '@/abis/UniswapV2Router02.json';
import { Abi } from 'viem';
export function useRouterContract() {
  const chainId = useChainId();
  return useContract(
    chainId && (SMART_ROUTER_ADDRESS as any)[chainId],
    ROUTERABI.abi as Abi,
  );
}
