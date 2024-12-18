import React from 'react';
import TxActionsWrapper from '../TxActionsWrapper';

interface SwithProps {
  inputAmount: string;
  inputToken: string;
  outputToken: string;
  slippage: string;
  blocked: boolean;
  loading?: boolean;
  isWrongNetwork: boolean;
  chainId: number;
  route?: any;
  inputName: string;
  outputName: string;
}


const SwitchActions = ({
  inputAmount,
  inputToken,
  inputName,
  outputName,
  outputToken,
  slippage,
  blocked,
  loading,
  isWrongNetwork,
  chainId,
  route,
}: SwithProps) => {
  return <TxActionsWrapper />;
};

export default SwitchActions;
