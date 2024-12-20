import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TxActionsWrapper from '../TxActionsWrapper';
import { useModalContext } from '@/hooks/useModal';
import { calculateSignedAmount } from '@/hooks/swap/common';
import { useRootStore } from '@/store/root';
import { getErc20Contract } from '@/utils/contractHelper';
import { Address, formatGwei, formatUnits, zeroAddress } from 'viem';
import { OptimalRate } from '@/hooks/useSellRates';
import { useGasPrice, useWalletClient } from 'wagmi';
import { useERC20 } from '@/hooks/useContract';
import { useWeb3React } from '../../../../packages/wagmi/src/useWeb3React';
import { Alert, Button, Snackbar } from '@mui/material';
import { calculateGasMargin } from '@/utils';
import { getErrorTextFromError, TxAction } from '@/ui-config/errorMapping';
import {
  gasLimitRecommendations,
  ProtocolAction,
} from '@aave/contract-helpers';
import { APPROVAL_GAS_LIMIT } from '../utils';

interface SwithProps {
  inputAmount: string;
  inputToken: string;
  outputToken: string;
  slippage: string;
  blocked: boolean;
  loading?: boolean;
  isWrongNetwork: boolean;
  chainId: number;
  route?: OptimalRate;
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
  const { chain } = useWeb3React();
  const [approvedAmount, setApprovedAmount] = useState<number | undefined>(
    undefined,
  );
  const ERC20contract = useERC20(inputToken as Address);
  const { data: walletClient } = useWalletClient();
  const { data: gasPrice } = useGasPrice({
    chainId,
  });
  const [user] = useRootStore((state) => [state.account]);
  const {
    approvalTxState,
    loadingTxns,
    mainTxState,
    setApprovalTxState,
    setLoadingTxns,
    setTxError,
    setGasLimit,
  } = useModalContext();

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
      try {
        const estimatedGasLimit = (await ERC20contract?.estimateGas?.approve(
          [route.tokenTransferProxy, amountToApprove as any],
          {
            account: user,
          },
        )) as bigint;
        setApprovalTxState({ ...approvalTxState, loading: true });
        const txWithGasEstimationRes = await ERC20contract?.write?.approve(
          [route.tokenTransferProxy, amountToApprove as any],
          {
            gas: calculateGasMargin(estimatedGasLimit),
            account: user,
            chain,
            gasPrice,
          },
        );
        setApprovalTxState({
          txHash: txWithGasEstimationRes,
          loading: false,
          success: true,
        });
        setTxError(undefined);
        fetchApprovedAmount();
      } catch (error) {
        const parsedError = getErrorTextFromError(
          error as any,
          TxAction.GAS_ESTIMATION,
          false,
        );
        setTxError(parsedError);
        setApprovalTxState({
          txHash: undefined,
          loading: false,
        });
      }
    }
  };

  const fetchApprovedAmount = useCallback(async () => {
    if (route?.tokenTransferProxy) {
      setApprovalTxState({
        txHash: undefined,
        loading: false,
        success: false,
      });
      setLoadingTxns(true);
      // 这里调用 交换的代币对的第0个代币的合约的 allowance 方法
      const erc20Service = getErc20Contract(route.srcToken);
      const approvedTargetAmount = await erc20Service?.read?.allowance([
        user,
        route.tokenTransferProxy,
      ]);
      setApprovedAmount(
        Number(formatUnits(approvedTargetAmount, route.srcDecimals)),
      );
      setLoadingTxns(false);
    }
  }, [
    route?.tokenTransferProxy,
    route?.srcDecimals,
    route?.srcToken,
    setApprovalTxState,
    setLoadingTxns,
    user,
  ]);

  const action = async () => {};

  useEffect(() => {
    if (user !== zeroAddress) {
      fetchApprovedAmount();
    }
  }, [user, fetchApprovedAmount]);

  useEffect(() => {
    let switchGasLimit = 0;
    switchGasLimit = Number(
      gasLimitRecommendations[ProtocolAction.withdrawAndSwitch].recommended,
    );
    if (requiresApproval && !approvalTxState.success) {
      switchGasLimit += Number(APPROVAL_GAS_LIMIT);
    }
    setGasLimit(switchGasLimit.toString());
  }, [requiresApproval, approvalTxState, setGasLimit]);

  return (
    <>
      {/* <Button variant="contained" onClick={approval}>
        aprove
      </Button> */}
      <TxActionsWrapper
        mainTxState={mainTxState}
        approvalTxState={approvalTxState}
        isWrongNetwork={isWrongNetwork}
        preparingTransactions={loadingTxns}
        handleAction={action}
        requiresAmount
        amount={inputAmount}
        handleApproval={() => approval()}
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
    </>
  );
};

export default SwitchActions;
