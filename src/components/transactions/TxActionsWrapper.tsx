import { TxStateType, useModalContext } from '@/hooks/useModal';
import { useWeb3Context } from '@/lib/hooks/useWeb3Context';
import { TxAction } from '@/ui-config/errorMapping';
import { CheckIcon } from '@heroicons/react/solid';
import { Box, BoxProps, SvgIcon } from '@mui/material';
import React, { ReactNode } from 'react';
import { ApprovalTooltip } from '../infoTooltips/ApprovalTooltip';

interface TxActionsWrapperProps extends BoxProps {
  actionInProgressText: ReactNode;
  actionText: ReactNode;
  amount?: string;
  approvalTxState?: TxStateType;
  handleApproval?: () => Promise<void>;
  handleAction: () => Promise<void>;
  isWrongNetwork: boolean;
  mainTxState: TxStateType;
  preparingTransactions: boolean;
  requiresAmount?: boolean;
  requiresApproval: boolean;
  symbol?: string;
  blocked?: boolean;
  fetchingData?: boolean;
  errorParams?: {
    loading: boolean;
    disabled: boolean;
    content: ReactNode;
    handleClick: () => Promise<void>;
  };
  tryPermit?: boolean;
}

const TxActionsWrapper = ({
  actionInProgressText,
  actionText,
  amount,
  approvalTxState,
  handleApproval,
  handleAction,
  isWrongNetwork,
  mainTxState,
  preparingTransactions,
  requiresAmount,
  requiresApproval,
  sx,
  symbol,
  blocked,
  fetchingData = false,
  errorParams,
  tryPermit,
  ...rest
}: TxActionsWrapperProps) => {
  const { txError } = useModalContext();
  const { readOnlyModeAddress } = useWeb3Context();
  const hasApprovalError =
    requiresApproval && txError?.txAction === TxAction.APPROVAL && txError?.actionBlocked;
  const isAmountMissing = requiresAmount && requiresAmount && Number(amount) === 0;


  function getMainParams() {
    if (blocked) return { disabled: true, content: actionText };
    if (
      (txError?.txAction === TxAction.GAS_ESTIMATION ||
        txError?.txAction === TxAction.MAIN_ACTION) &&
      txError?.actionBlocked
    ) {
      if (errorParams) return errorParams;
      return { loading: false, disabled: true, content: actionText };
    }
    if (isWrongNetwork) return { disabled: true, content: <>Wrong Network</> };
    if (fetchingData) return { disabled: true, content: <>Fetching data...</> };
    if (isAmountMissing) return { disabled: true, content: <>Enter an amount</> };
    if (preparingTransactions) return { disabled: true, loading: true };
    // if (hasApprovalError && handleRetry)
    //   return { content: <>Retry with approval</>, handleClick: handleRetry };
    if (mainTxState?.loading)
      return { loading: true, disabled: true, content: actionInProgressText };
    if (requiresApproval && !approvalTxState?.success)
      return { disabled: true, content: actionText };
    return { content: actionText, handleClick: handleAction };
  }

  function getApprovalParams() {
    if (
      !requiresApproval ||
      isWrongNetwork ||
      isAmountMissing ||
      preparingTransactions ||
      hasApprovalError
    )
      return null;
    if (approvalTxState?.loading)
      return { loading: true, disabled: true, content: <>Approving {symbol}...</> };
    if (approvalTxState?.success)
      return {
        disabled: true,
        content: (
          <>
            <>Approve Confirmed</>
            <SvgIcon sx={{ fontSize: 20, ml: 2 }}>
              <CheckIcon />
            </SvgIcon>
          </>
        ),
      };

    return {
      content: (
        <ApprovalTooltip
          variant="buttonL"
          iconSize={20}
          iconMargin={2}
          color="white"
          text={<>Approve {symbol} to continue</>}
        />
      ),
      handleClick: handleApproval,
    };
  }

  const { content, disabled, loading, handleClick } = getMainParams();

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', mt: 12, ...sx }}
      {...rest}
    >
      {/* {approvalParams && !readOnlyModeAddress && (
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
          <RightHelperText approvalHash={approvalTxState?.txHash} tryPermit={tryPermit} />
        </Box>
      )} */}
      33333
    </Box>
  );
};

export default TxActionsWrapper;
