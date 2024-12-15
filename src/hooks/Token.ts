import { ERC20Token, Currency, NativeCurrency, Token } from '@pancakeswap/sdk';
import { useActiveChainId } from './useActiveChainId';
import { safeGetAddress } from '@/utils';
import { useReadContracts } from '../../packages/wagmi/src/hooks/useReadContracts';
import { ERC20_ABI } from '@/abis/Erc20';
import { useMemo } from 'react';
import { UnsafeCurrency } from '@/config/constants/types';
import useNativeCurrency from './useNatieCurrency';
import { GELATO_NATIVE } from '@/config/constants';
import { zeroAddress } from 'viem';

export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId();
  return useTokenByChainId(tokenAddress, chainId);
}

export function useTokenByChainId(
  tokenAddress?: string,
  chainId?: number,
): ERC20Token | undefined | null {
  const address = safeGetAddress(tokenAddress);
  // const token: ERC20Token | undefined = address && chainId ?

  const { data, isLoading } = useReadContracts({
    allowFailure: false,
    contracts: [
      {
        chainId,
        address,
        abi: ERC20_ABI,
        functionName: 'decimals',
      },
      {
        chainId,
        address,
        abi: ERC20_ABI,
        functionName: 'symbol',
      },
      {
        chainId,
        address,
        abi: ERC20_ABI,
        functionName: 'name',
      },
      {
        chainId,
        address,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
      },
    ],
    query: {
      enabled: Boolean(address),
      staleTime: Infinity,
    },
  });

  return useMemo(() => {
    if (!chainId || !address) return undefined;
    if (isLoading) return null;
    if (data) {
      return new ERC20Token(
        chainId,
        address,
        data[0],
        data[1] ?? 'UNKNOWN',
        data[2] ?? 'Unknown Token',
      );
    }
    return undefined;
  }, [chainId, address, isLoading, data]);
}

export function useCurrency(currencyId: string | undefined): UnsafeCurrency {
  const native: NativeCurrency = useNativeCurrency();
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() ||
    currencyId?.toLowerCase() === GELATO_NATIVE ||
    currencyId?.toLowerCase() === zeroAddress;

  const token = useToken(isNative ? undefined : currencyId);
  return isNative ? native : token;
}
