import { TxStateType } from '@/hooks/useModal';
import { useWeb3Context } from '@/lib/hooks/useWeb3Context';
import {
  Box,
  BoxProps,
  Button,
  CircularProgress,
  SvgIcon,
} from '@mui/material';
import React, { ReactNode } from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import { ApprovalTooltip } from '../infoTooltips/ApprovalTooltip';
interface TxActionsWrapperProps extends BoxProps {
  approvalTxState?: TxStateType;
  isWrongNetwork: boolean;
  preparingTransactions: boolean;
  requiresAmount?: boolean;
  amount?: string;
  handleApproval?: () => Promise<void>;
  handleAction: () => Promise<void>;
  requiresApproval: boolean;
  actionText: ReactNode;
  actionInProgressText: ReactNode;
  fetchingData?: boolean;
  symbol?: string;
  errorParams?: {
    loading: boolean;
    disabled: boolean;
    content: ReactNode;
    handleClick: () => Promise<void>;
  };
  blocked?: boolean;
}

const TxActionsWrapper = ({
  approvalTxState,
  isWrongNetwork,
  preparingTransactions,
  requiresAmount,
  amount,
  handleApproval,
  requiresApproval,
  actionInProgressText,
  errorParams,
  fetchingData = false,
  sx,
  symbol,
  blocked,
  actionText,
  handleAction,
  ...rest
}: TxActionsWrapperProps) => {
  const { readOnlyModeAddress } = useWeb3Context();
  const isAmountMissing =
    requiresAmount && requiresAmount && Number(amount) === 0;
  // get main params
  const getMainParams = () => {
    if (blocked) return { disabled: true, content: actionText };
    if (isWrongNetwork) return { disabled: true, content: <>Wrong Network</> };
    if (fetchingData) return { disabled: true, content: <>Fetching data...</> };
    if (preparingTransactions) return { disabled: true, loading: true };
    // if (hasApprovalError && handleRetry)
    //   return { content: <>Retry with approval</>, handleClick: handleRetry };
    // if (mainTxState?.loading)
    //   return { loading: true, disabled: true, content: actionInProgressText };
    if (requiresApproval && !approvalTxState?.success)
      return { disabled: true, content: actionText };
    return { content: actionText, handleClick: handleAction };
  };

  const getApprovalParams = () => {
    // if (
    //   !requiresApproval ||
    //   isWrongNetwork ||
    //   isAmountMissing ||
    //   preparingTransactions
    //   // || hasApprovalError
    //   // TODO: 这里需要完善下
    // ) {
    //   return null;
    // }

    if (approvalTxState?.loading) {
      return {
        loading: true,
        disabled: true,
        content: <>Approving {symbol}...</>,
      };
    }
    if (approvalTxState?.success) {
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
    }

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
  };

  const { content, disabled, loading, handleClick } = getMainParams();
  const approvalParams = getApprovalParams();
  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', mt: 12, ...sx }}
      {...rest}
    >
      {approvalParams && !readOnlyModeAddress && (
        <Button
          variant="contained"
          // disabled={approvalParams.disabled || blocked}
          onClick={() =>
            approvalParams.handleClick && approvalParams.handleClick()
          }
          size="large"
          sx={{ minHeight: '44px' }}
          data-cy="approvalButton"
        >
          {approvalParams.loading && (
            <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
          )}
          {approvalParams.content}
        </Button>
      )}

      {/* <Button
        variant="contained"
        // disabled={disabled || blocked || readOnlyModeAddress !== undefined}
        onClick={handleClick}
        size="large"
        // sx={{ minHeight: '44px', ...(approvalParams ? { mt: 2 } : {}) }}
        data-cy="actionButton"
      >
        {loading && (
          <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
        )}
        {content}
      </Button> */}
    </Box>
  );
};

export default TxActionsWrapper;
