import React, { useMemo } from 'react';
import TxActionsWrapper from '../TxActionsWrapper';
import { useModalContext } from '@/hooks/useModal';
import { calculateSignedAmount } from '@/hooks/swap/common';

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
  const { approvalTxState,loadingTxns } = useModalContext();
  const requiresApproval = useMemo(() => {
    return false
  },[])

  const approval = async() => {
    if(route) {
      const amountToApprove = calculateSignedAmount(inputAmount, route.srcDecimals, 0);
    }
  }

  const action = async() => {
  }

  return (
    <TxActionsWrapper
      approvalTxState={approvalTxState}
      isWrongNetwork={isWrongNetwork}
      preparingTransactions={loadingTxns}
      requiresAmount
      amount={inputAmount}
      handleApproval={() => approval()}
      handleAction={action}
      requiresApproval={!blocked && requiresApproval}
      actionText={<>Switch</>}
      actionInProgressText={<>Switching</>}
      errorParams={{
        loading: false,
        disabled: blocked || (!approvalTxState.success && requiresApproval),
        content: <>Switch</>,
        handleClick: action,
      }}
      fetchingData={loading}
      blocked={blocked}
    />
  );
};

export default SwitchActions;
