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
  // route?: OptimalRate;
  inputName: string;
  outputName: string;
}


const SwitchActions = () => {
  return <TxActionsWrapper />;
};

export default SwitchActions;
