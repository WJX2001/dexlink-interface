import { useQuery } from '@tanstack/react-query';
import { useRouterContract } from './useRouterContract';
import { queryKeysFactory } from '@/ui-config/queries';
import { parseUnits } from 'viem';

type SwapSellRatesParams = {
  amount: string;
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  chainId: number;
  user: string;
};

type SwapSellRatesResult = {
  destAmount: string; // 假设 getAmountsOut 返回一个 `bigint[]`
  destDecimals: number;
  destUSD: string
  srcDecimals: number
};

export const useSwapSellRates = ({
  chainId,
  amount,
  srcToken,
  srcDecimals,
  destToken,
  destDecimals,
  user,
}: SwapSellRatesParams) => {
  const routerContract = useRouterContract();
  return useQuery<SwapSellRatesResult | undefined>({
    // @ts-ignore
    queryFn: async () => {
      const valuesout = (await routerContract?.read?.getAmountsOut([
        amount,
        [srcToken, destToken],
      ])) as bigint[];
      return {
        destAmount: valuesout[1].toString(),
        destDecimals,
        destUSD: '0',
        srcDecimals
      };
    },
    queryKey: queryKeysFactory.swapRates(
      chainId,
      amount,
      srcToken,
      destToken,
      user,
    ),
    enabled: amount !== '0',
    retry: 0,
    refetchOnWindowFocus: (query) => (query.state.error ? false : true),
  });
};
