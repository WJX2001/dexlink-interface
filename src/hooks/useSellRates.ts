import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useRouterContract } from './useRouterContract';
import { queryKeysFactory } from '@/ui-config/queries';
import { Address, parseUnits } from 'viem';
import { SMART_ROUTER_ADDRESS } from '@/smart-router/constants/exchange';

type SwapSellRatesParams = {
  amount: string;
  srcToken: string;
  srcDecimals: number;
  destToken: string;
  destDecimals: number;
  chainId: number;
  user: string;
};

export interface OptimalRate {
  network: number;
  srcToken: Address;
  srcDecimals: number;
  srcAmount: string;
  srcUSD: string;
  destToken: Address;
  destAmount: string; // 假设 getAmountsOut 返回一个 `bigint[]`
  destDecimals: number;
  destUSD: string;
  tokenTransferProxy:  Address;
};

export const useSwapSellRates = ({
  chainId,
  amount,
  srcToken,
  srcDecimals,
  destToken,
  destDecimals,
  user,
}: SwapSellRatesParams): ReturnType<typeof useQuery<OptimalRate>> => {
  const routerContract = useRouterContract();
   // @ts-ignore
  return useQuery<OptimalRate>({
    // @ts-ignore
    queryFn: async () => {
      const valuesout = (await routerContract?.read?.getAmountsOut([
        amount,
        [srcToken, destToken],
      ])) as bigint[];
      return {
        network: chainId,
        srcToken,
        srcDecimals,
        srcAmount: amount,
        srcUSD: '0',
        destToken,
        destAmount: valuesout[1].toString(),
        destDecimals,
        destUSD: '0',
        tokenTransferProxy: SMART_ROUTER_ADDRESS[chainId], // 这里要写成我们的路由合约地址作为 后续操作的spender
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
