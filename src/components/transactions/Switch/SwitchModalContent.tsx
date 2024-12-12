import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import React from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { useIsWrongNetwork } from '@/hooks/useIsWrongNetwork';
import { useChainId } from 'wagmi';
import ChangeNetworkWarning from '../Warnings/ChangeNetworkWarning';
import { TMPNETWORK } from '@/ui-config/TokenList';
import { ChainId } from '@aave/contract-helpers';
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
      {isWrongNetwork.isWrongNetwork && (
        <ChangeNetworkWarning
          networkName={ChainId[TMPNETWORK]} // TODO:  这里临时处理下 后续需要修改
          chainId={selectedChainId}
        />
      )}
    </>
  );
};

export default SwitchModalContent;
