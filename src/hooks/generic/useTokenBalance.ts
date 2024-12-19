import { TokenInfo } from '@/ui-config/TokenList';

import { usePublicClient, useReadContracts } from 'wagmi';
import { Address, formatUnits } from 'viem';
import { ERC20_ABI } from '@/abis/Erc20';
import { useQuery } from '@tanstack/react-query';
import { queryKeysFactory } from '@/ui-config/queries';
export interface TokenInfoWithBalance extends TokenInfo {
  balance: string;
  oracle?: string;
}

export const useTokensBalance = (
  tokenList: TokenInfo[],
  user?: string,
  chainId?: number,
): TokenInfoWithBalance[] | undefined => {
  const contracts = tokenList?.map((token) => {
    return {
      address: token.address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [user],
      chainId,
    };
  });

  const { data: results } = useReadContracts({
    // @ts-ignore
    contracts: contracts,
  });

  if (results) {
    let balanceArr = results.map((item) => item.result);
    return tokenList
      .map((elem, index) => ({
        ...elem,
        balance: formatUnits(balanceArr[index] as bigint, elem.decimals),
      }))
      .sort((a, b) => Number(b.balance) - Number(a.balance));
  } else {
    return undefined;
  }
};

export const useTokensBalancePlus = (
  tokenList: TokenInfo[],
  chainId: number,
  user: string,
) => {
  const publicClient = usePublicClient({ chainId });
  console.log(publicClient,'publicClient')
  const contracts = tokenList?.map((token) => {
    return {
      address: token.address,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [user],
      chainId,
    };
  });
  return useQuery({
    queryKey: queryKeysFactory.tokensBalance(tokenList, chainId, user),
    enabled: tokenList.length > 0,
    queryFn: async () => {
      const results = await publicClient?.multicall({
        // @ts-ignore
        contracts: contracts,
        allowFailure: true,
      });
      if (results) {
        let balanceArr = results.map((item) => item.result);
        return tokenList
          .map((elem, index) => ({
            ...elem,
            balance: formatUnits(balanceArr[index] as bigint, elem.decimals),
          }))
          .sort((a, b) => Number(b.balance) - Number(a.balance));
      } else {
        return undefined;
      }
    },
  });
};
