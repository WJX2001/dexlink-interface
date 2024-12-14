import { useRootStore } from '@/store/root';
import { isChainSupported } from '@/utils/wagmi';
import { useDeferredValue, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';

export function useLocalNetworkChain(wagmiChainId: number | undefined) {
  if (wagmiChainId && isChainSupported(wagmiChainId)) {
    return wagmiChainId;
  }

  return undefined;
}

export const useActiveChainId = () => {
  const { chainId: wagmiChainId } = useAccount();
  const localChainId = useLocalNetworkChain(wagmiChainId);
  const realChainId = useRootStore((store) => store.currentChainId);
  const chainId = localChainId ?? wagmiChainId ?? undefined;

  const isNotMatched = useDeferredValue(
    wagmiChainId && localChainId && wagmiChainId !== localChainId,
  );
  const isWrongNetwork = useMemo(
    () =>
      Boolean(
        ((wagmiChainId && !isChainSupported(wagmiChainId)) ?? false) ||
          isNotMatched,
      ),
    [wagmiChainId, isNotMatched],
  );

  return {
    chainId: chainId && isChainSupported(chainId) ? chainId : realChainId,
    isWrongNetwork,
    isNotMatched,
  };
};
