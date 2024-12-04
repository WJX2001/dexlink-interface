import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import React from 'react';

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
  return <div>SwitchModalContent</div>;
};

export default SwitchModalContent;
