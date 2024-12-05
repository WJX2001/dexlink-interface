import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import React from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { useIsWrongNetwork } from '@/hooks/useIsWrongNetwork';
import { useChainId } from 'wagmi';

interface SwitchModalContentProps {
  selectedChainId: number;
  setSelectedChainId: (value: number) => void;
  tokens: TokenInfoWithBalance[];
  defaultInputToken: TokenInfoWithBalance;
  defaultOutputToken: TokenInfoWithBalance;
}

const SwitchModalContent = ({
  selectedChainId,
  setSelectedChainId,
  defaultInputToken,
  defaultOutputToken,
  tokens,
}: SwitchModalContentProps) => {
  const isWrongNetwork = useIsWrongNetwork(selectedChainId);
  return (
    <>
      <TxModalTitle title="Switch tokens" />
      {isWrongNetwork.isWrongNetwork && "错了"}
    </>
  );
};

export default SwitchModalContent;
