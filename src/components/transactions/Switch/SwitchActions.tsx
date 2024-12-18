import React, { useMemo, useState } from 'react';
import TxActionsWrapper from '../TxActionsWrapper';
import { useModalContext } from '@/hooks/useModal';
import { calculateSignedAmount } from '@/hooks/swap/common';
import { useRootStore } from '@/store/root';


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
  const [approvedAmount, setApprovedAmount] = useState<number | undefined>(
    undefined,
  );

  const [user] = useRootStore((state) => [state.account]);

  const { approvalTxState, loadingTxns, setApprovalTxState,setLoadingTxns } =
    useModalContext();

  const requiresApproval = useMemo(() => {
    if (
      approvedAmount === undefined ||
      approvedAmount === -1 ||
      inputAmount === '0' ||
      isWrongNetwork
    )
      return false;
    else return approvedAmount < Number(inputAmount);
  }, [approvedAmount, inputAmount, isWrongNetwork]);

  const approval = async () => {
    if (route) {
      const amountToApprove = calculateSignedAmount(
        inputAmount,
        route.srcDecimals,
        0,
      );
    }
  };

  const fetchApprovedAmount = async () => {
    if (route?.tokenTransferProxy) {
      setApprovalTxState({
        txHash: undefined,
        loading: false,
        success: false,
      });
      setLoadingTxns(true);
      // 这里调用 交换的代币对的第0个代币的合约的 allowance 方法
    }
  };

  const action = async () => {};

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
