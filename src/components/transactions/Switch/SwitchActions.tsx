import React, { useCallback, useEffect, useMemo, useState } from 'react';
import TxActionsWrapper from '../TxActionsWrapper';
import { useModalContext } from '@/hooks/useModal';
import { calculateSignedAmount } from '@/hooks/swap/common';
import { useRootStore } from '@/store/root';
import { getErc20Contract } from '@/utils/contractHelper';
import {
  Address,
  formatGwei,
  formatUnits,
  Hash,
  parseUnits,
  zeroAddress,
} from 'viem';
import { OptimalRate } from '@/hooks/useSellRates';
import { useGasPrice, usePublicClient, useWalletClient } from 'wagmi';
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
import { useRouterContract } from '@/hooks/useRouterContract';
import toast, { Toaster } from 'react-hot-toast';
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
  const [approvedAmount, setApprovedAmount] = useState<number | undefined>(
    undefined,
  );
  const { chain } = useWeb3React();
  const routerContract = useRouterContract();
  const ERC20contract = useERC20(inputToken as Address);
  const publicClient = usePublicClient({ chainId });
  const { data: gasPrice } = useGasPrice({
    chainId,
  });
  const [user] = useRootStore((state) => [state.account]);

  const {
    approvalTxState,
    loadingTxns,
    mainTxState,
    setApprovalTxState,
    setMainTxState,
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

  const swapAfterGetReceipt = async (txHash: Hash) => {
    const receipt = await publicClient?.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 5,
    });
    if (receipt?.status === 'success') {
      setMainTxState({
        txHash,
        loading: false,
        success: true,
      });
      toast.success('Swap success');
    } else {
      toast.error('Swap failed');
      setApprovalTxState({
        loading: false,
      });
    }
  };

  const action = async () => {
    if (route) {
      try {
        setMainTxState({ ...mainTxState, loading: true });
        const tokenAddress = [route.srcToken, route.destToken];
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 200000);
        const wethAddress = await routerContract?.read?.WETH();
        if (route.srcToken === wethAddress) {
          const txHash = (await routerContract?.write?.swapExactETHForTokens(
            [BigInt(route.destAmount), tokenAddress, user, deadline],
            {
              account: user,
              chain,
              value: parseUnits(inputAmount, route.srcDecimals),
            },
          )) as Hash;
          await swapAfterGetReceipt(txHash);
        } else if (route.destToken === wethAddress) {
          const txHash = (await routerContract?.write?.swapExactTokensForETH(
            [
              parseUnits(inputAmount, route.srcDecimals),
              BigInt(route.destAmount),
              tokenAddress,
              user,
              deadline,
            ],
            {
              account: user,
              chain,
            },
          )) as Hash;
          await swapAfterGetReceipt(txHash);
        } else {
          const txHash = (await routerContract?.write?.swapExactTokensForTokens(
            [
              parseUnits(inputAmount, route.srcDecimals),
              BigInt(route.destAmount),
              tokenAddress,
              user,
              deadline,
            ],
            {
              account: user,
              chain,
            },
          )) as Hash;
          await swapAfterGetReceipt(txHash);
        }
      } catch (error: any) {
        const parsedError = getErrorTextFromError(
          error,
          TxAction.GAS_ESTIMATION,
          false,
        );
        setTxError(parsedError);
        setMainTxState({
          txHash: undefined,
          loading: false,
        });
      }
    }
  };

  const approval = async () => {
    if (route) {
      const amountToApprove = calculateSignedAmount(
        inputAmount,
        route.srcDecimals,
        0,
      );
      try {
        // estimate gas
        const estimatedGasLimit = (await ERC20contract?.estimateGas?.approve(
          [route.tokenTransferProxy, amountToApprove as any],
          {
            account: user,
          },
        )) as bigint;
        setApprovalTxState({ ...approvalTxState, loading: true });
        // approve
        const txWithGasEstimationRes = (await ERC20contract?.write?.approve(
          [route.tokenTransferProxy, amountToApprove as any],
          {
            gas: calculateGasMargin(estimatedGasLimit),
            account: user,
            chain,
            gasPrice,
          },
        )) as Hash;
        // wait transaction receipt
        const receipt = await publicClient?.waitForTransactionReceipt({
          hash: txWithGasEstimationRes,
          confirmations: 5,
        });
        if (receipt?.status === 'success') {
          setApprovalTxState({
            txHash: txWithGasEstimationRes,
            loading: false,
            success: true,
          });
          setTxError(undefined);
          fetchApprovedAmount();
          toast.success('Approve success');
        } else {
          toast.error('Approve failed');
          setApprovalTxState({
            loading: false,
          });
        }
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
      <Toaster />
    </>
  );
};

export default SwitchActions;
