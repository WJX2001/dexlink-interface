import { useChainId } from 'wagmi';
import { useRootStore } from '@/store/root';

export function useIsWrongNetwork(_requiredChainId?: number) {
  const currentChainId = useRootStore((store) => store.currentChainId)
  const connectedChainId = useChainId();

  const requiredChainId = _requiredChainId ? _requiredChainId : currentChainId;
  const isWrongNetwork = connectedChainId !== requiredChainId;

  return {
    isWrongNetwork,
    requiredChainId,
  };
}
