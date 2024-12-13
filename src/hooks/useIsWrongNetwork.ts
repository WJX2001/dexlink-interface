import { useAccount, useChainId } from 'wagmi';
import { useRootStore } from '@/store/root';
import { useProtocolDataContext } from './useProtocolDataContext';

export function useIsWrongNetwork(_requiredChainId?: number) {
  const currentChainId = useRootStore((store) => store.currentChainId);
  // const { currentChainId } = useProtocolDataContext();
  const { chainId: connectedChainId } = useAccount();

  const requiredChainId = _requiredChainId ? _requiredChainId : currentChainId;
  const isWrongNetwork = connectedChainId !== requiredChainId;

  return {
    isWrongNetwork,
    requiredChainId,
  };
}
