import { TokenInfo } from '@/ui-config/TokenList';
import ERC20 from '@/abis/ERC20.json';
import { useReadContracts } from 'wagmi';
import { Address, formatUnits } from 'viem';
export interface TokenInfoWithBalance extends TokenInfo {
  balance: string;
  oracle?: string;
}

export const useTokensBalance = (
  tokenList: TokenInfo[],
  user?: string,
  chainId?: number,
) => {
  const contracts = tokenList?.map((token) => {
    return {
      address: token.address,
      abi: ERC20.abi,
      functionName: 'balanceOf',
      args: [user],
      chainId
    };
  });

  const { data: results } = useReadContracts({
    // @ts-ignore
    contracts: contracts,
  });

  if (results) {
    let balanceArr = results.map((item) => item.result);
    return tokenList.map((elem, index) => ({
      ...elem,
      balance: formatUnits(balanceArr[index] as bigint, elem.decimals),
    })).sort((a, b) => Number(b.balance) - Number(a.balance));;
  } else {
    return undefined
  }
};
