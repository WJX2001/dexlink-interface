import { useChainId } from 'wagmi';
import { useContract } from './useContract';
import { SMART_ROUTER_ADDRESS } from '@/smart-router/constants/exchange';
import { Abi } from 'viem';
import { IUNISWAP_V2_ROUTER_ABI } from '@/abis/IUniswapV2Router02';
export function useRouterContract() {
  const chainId = useChainId();
  return useContract(
    chainId && (SMART_ROUTER_ADDRESS as any)[chainId],
    IUNISWAP_V2_ROUTER_ABI
  );
}
