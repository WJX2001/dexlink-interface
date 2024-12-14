import { useRootStore } from '@/store/root';
import { isChainSupported } from '@/utils/wagmi';
import { useDeferredValue, useMemo } from 'react';
import { useAccount, useChainId } from 'wagmi';

export function useLocalNetworkChain() {
  const { chainId } = useAccount();
  if (chainId && isChainSupported(chainId)) {
    return chainId;
  }

  return undefined;
}

export const useActiveChainId = () => {
  const localChainId = useLocalNetworkChain();
  const realChainId = useRootStore((store) => store.currentChainId);
  const { chainId: wagmiChainId } = useAccount();
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
