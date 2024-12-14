import { useQuery } from '@tanstack/react-query';
import { useBlockNumber as useWagmiBlockNumber } from 'wagmi';

type Params = {
  chainId?: number;
  enabled?: boolean;
};

function createKeyGetter(name: string) {
  return function getKey(chainId?: number) {
    return [name, chainId];
  };
}

export const getInitialBlockTimestampQueryKey = createKeyGetter(
  'initialBlockTimestamp',
);

export function useBlockNumber({
  chainId,
  watch,
}: Omit<Params, 'enabled'> & { watch?: boolean }):
  | ReturnType<typeof useWatchedBlockNumber>
  | ReturnType<typeof useWagmiBlockNumber> {
  const watchedBlockNumber = useWatchedBlockNumber({ chainId });
  const blockNumber = useWagmiBlockNumber({
    chainId,
    query: { enabled: !watch },
    watch: false,
  });
  return watch ? watchedBlockNumber : blockNumber;
}

export function useWatchedBlockNumber({ chainId }: Omit<Params, 'enabled'>) {
  return useQuery<bigint>({
    queryKey: getInitialBlockTimestampQueryKey(chainId),
    enabled: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}
