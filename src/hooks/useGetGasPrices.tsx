import { queryKeysFactory } from '@/ui-config/queries';
import { TMPNETWORK } from '@/ui-config/TokenList';
import { useQueries } from '@tanstack/react-query';
import { PublicClient } from 'viem';
import { usePublicClient } from 'wagmi';

type GasInfo = {
  legacyGasPrice: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

export enum GasOption {
  Slow = 'slow',
  Normal = 'normal',
  Fast = 'fast',
  Custom = 'custom',
}

export type GasPriceData = {
  [GasOption.Slow]: GasInfo;
  [GasOption.Normal]: GasInfo;
  [GasOption.Fast]: GasInfo;
};

type FeeData = {
  gasPrice: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

const POLLING_INTERVAL = 30000;

export const rawToGasPriceData = (feeData: FeeData): GasPriceData => {
  const gasInfo: GasInfo = {
    legacyGasPrice: feeData.gasPrice?.toString() || '0',
    maxFeePerGas: feeData.maxFeePerGas?.toString() || '0',
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toString() || '0',
  };
  return {
    [GasOption.Slow]: gasInfo,
    [GasOption.Normal]: gasInfo,
    [GasOption.Fast]: gasInfo,
  };
};

export const useGasPrices = (chainIds: number[]) => {
  const publicClient = usePublicClient({ chainId: TMPNETWORK }) as PublicClient;
  return useQueries({
    queries: chainIds.map((chainId) => ({
      queryKey: queryKeysFactory.gasPrices(chainId),
      queryFn: async () => {
        // 使用 Promise.all 并行执行异步请求
        const [feeData, gasPrice] = await Promise.all([
          publicClient.estimateFeesPerGas(),
          publicClient.getGasPrice(),
        ]);

        const { maxFeePerGas, maxPriorityFeePerGas } = feeData;

        // 构建 feeData 对象
        const combinedFeeData = {
          gasPrice,
          maxFeePerGas,
          maxPriorityFeePerGas,
        };
        // 调用 rawToGasPriceData 函数处理数据
        return rawToGasPriceData(combinedFeeData);
      },
      refetchInterval: POLLING_INTERVAL,
      enabled: publicClient !== undefined,
    })),
  });
};

export const useGasPrice = (chainId: number) => {
  return useGasPrices([chainId])[0];
};
