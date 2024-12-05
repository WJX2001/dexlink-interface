import { useRootStore } from '@/store/root';

export const useProtocolDataContext = () => {
  return useRootStore(({ currentChainId }) => ({ currentChainId }));
};
