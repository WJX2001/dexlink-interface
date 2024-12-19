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
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import { calculateGasMargin } from '@/utils';

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
  const {data: gasPrice} = useGasPrice({
    chainId,
  });
  const [user] = useRootStore((state) => [state.account]);
  const { approvalTxState, loadingTxns, setApprovalTxState, setLoadingTxns } =
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
    let call;
    if (route) {
      const amountToApprove = calculateSignedAmount(
        inputAmount,
        route.srcDecimals,
        0,
      );
      try {
        call = ERC20contract?.estimateGas
          ?.approve([route.tokenTransferProxy, amountToApprove as any], {
            account: user,
          })
          .then((estimatedGasLimit) => {
            debugger;
            return ERC20contract?.write?.approve(
              [route.tokenTransferProxy, amountToApprove as any],
              {
                gas: calculateGasMargin(estimatedGasLimit),
                account: user,
                chain,
                gasPrice,
              },
            );
          });

        // let estimatedGasBN = ethers.BigNumber.from(estimatedGas);

        // // 增加 15% 安全余量
        // estimatedGasBN = estimatedGasBN.mul(115).div(100);
      } catch (e) {
        console.log(e);
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

  return (
    <Button variant="contained" onClick={approval}>
      aprove
    </Button>
    // <TxActionsWrapper
    //   approvalTxState={approvalTxState}
    //   isWrongNetwork={isWrongNetwork}
    //   preparingTransactions={loadingTxns}
    //   requiresAmount
    //   amount={inputAmount}
    //   handleApproval={() => approval()}
    //   handleAction={action}
    //   requiresApproval={!blocked && requiresApproval}
    //   actionText={<>Switch</>}
    //   actionInProgressText={<>Switching</>}
    //   errorParams={{
    //     loading: false,
    //     disabled: blocked || (!approvalTxState.success && requiresApproval),
    //     content: <>Switch</>,
    //     handleClick: action,
    //   }}
    //   fetchingData={loading}
    //   blocked={blocked}
    // />
  );
};

export default SwitchActions;
