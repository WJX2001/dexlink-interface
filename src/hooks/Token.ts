import { ERC20Token, Currency, NativeCurrency, Token } from '@pancakeswap/sdk';
import { useActiveChainId } from './useActiveChainId';
import { safeGetAddress } from '@/utils';

export function useToken(tokenAddress?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId();

  return useTokenByChainId(tokenAddress, chainId);
}

export function useTokenByChainId(
  tokenAddress?: string,
  chainId?: number,
): ERC20Token | undefined | null {
  
  const address = safeGetAddress(tokenAddress)
  // const token: ERC20Token | undefined = address && chainId ? 
}
