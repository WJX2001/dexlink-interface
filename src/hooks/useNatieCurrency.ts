import { ChainId } from '@/smart-router/constants/chainIdList';
import { Native, NativeCurrency } from '@pancakeswap/sdk';
import { useActiveChainId } from './useActiveChainId';
import { useMemo } from 'react';

export default function useNativeCurrency(
  overrideChainId?: ChainId,
): NativeCurrency {
  const { chainId } = useActiveChainId();
  debugger
  return useMemo(() => {
    try {
      return Native.onChain(overrideChainId ?? chainId ?? ChainId.bnb);
    } catch (e) {
      return Native.onChain(ChainId.bnb);
    }
  }, [overrideChainId, chainId]);
}
