
import { useGasPrice } from '@/hooks/useGetGasPrices';
import { useRootStore } from '@/store/root';
import React, { ReactNode } from 'react';

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
  const [currentChainId, account] = useRootStore((store) => [store.currentChainId, store.account]);
  const selectedChainId = chainId ?? currentChainId
  const { data: gasPrice } = useGasPrice(selectedChainId);
  console.log(gasPrice,'我看看')
  return 1111111;
};

export default GasStation;
