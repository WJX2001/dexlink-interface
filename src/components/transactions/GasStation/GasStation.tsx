import { useGasStation } from '@/hooks/useGasStation';
import { useGasPrice } from '@/hooks/useGetGasPrices';
import { useRootStore } from '@/store/root';
import { marketsData } from '@/utils/marketsAndNetworksConfig';
import React, { ReactNode } from 'react';
import invariant from 'tiny-invariant';

export interface GasStationProps {
  gasLimit: bigint;
  skipLoad?: boolean;
  disabled?: boolean;
  rightComponent?: ReactNode;
  chainId?: number;
}

const GasStation: React.FC<GasStationProps> = ({
  gasLimit,
  skipLoad,
  disabled,
  rightComponent,
  chainId,
}) => {
  const { state } = useGasStation();
  const [currentChainId, account] = useRootStore((store) => [
    store.currentChainId,
    store.account,
  ]);
  const selectedChainId = chainId ?? currentChainId;

  // 这里有两个fuji 测试网 所以临时加白一下取 不为v3版本的
  const marketOnNetwork = Object.values(marketsData)
    .filter((elem) => elem.chainId === selectedChainId)
    .find((elem) => !elem.v3);
  console.log(marketOnNetwork, 'marketOnNetwork');
  invariant(marketOnNetwork, 'No market for this network');
  const { data: gasPrice } = useGasPrice(selectedChainId);

  



  return 1111111;
};

export default GasStation;
