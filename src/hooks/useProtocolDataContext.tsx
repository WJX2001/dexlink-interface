import { useRootStore } from '@/store/root';

export const useProtocolDataContext = () =>
  useRootStore(({ currentChainId }) => ({
    currentChainId,
  }));
