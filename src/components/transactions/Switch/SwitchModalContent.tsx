import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import React, { useState } from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { useIsWrongNetwork } from '@/hooks/useIsWrongNetwork';
import { useChainId } from 'wagmi';
import ChangeNetworkWarning from '../Warnings/ChangeNetworkWarning';
import { TMPNETWORK } from '@/ui-config/TokenList';
import { ChainId } from '@/smart-router/constants/chainIdList';
import { SupportedNetworkWithChainId } from './common';
import { getNetworkConfig } from '@/utils/marketsAndNetworksConfig';
import { Box } from '@mui/material';
import SwitchSlippageSelector from './SwitchSlippageSelector';
interface SwitchModalContentProps {
  selectedChainId: number;
  setSelectedChainId: (value: number) => void;
  supportedNetworks: SupportedNetworkWithChainId[];
  tokens: TokenInfoWithBalance[];
  defaultInputToken: TokenInfoWithBalance;
  defaultOutputToken: TokenInfoWithBalance;
}

enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
}
export interface ValidationData {
  message: string;
  severity: ValidationSeverity;
}

const validateSlippage = (slippage: string): ValidationData | undefined => {
  try {
    const numberSlippage = Number(slippage);
    if (Number.isNaN(numberSlippage))
      return {
        message: 'Invalid slippage',
        severity: ValidationSeverity.ERROR,
      };
    if (numberSlippage > 30)
      return {
        message: 'Slippage must be lower 30%',
        severity: ValidationSeverity.ERROR,
      };
    if (numberSlippage < 0)
      return {
        message: 'Slippage must be positive',
        severity: ValidationSeverity.ERROR,
      };
    if (numberSlippage > 10)
      return {
        message: 'High slippage',
        severity: ValidationSeverity.WARNING,
      };
    if (numberSlippage < 0.1)
      return {
        message: 'Slippage lower than 0.1% may result in failed transactions',
        severity: ValidationSeverity.WARNING,
      };
    return undefined;
  } catch {
    return { message: 'Invalid slippage', severity: ValidationSeverity.ERROR };
  }
};

const SwitchModalContent = ({
  selectedChainId,
  setSelectedChainId,
  defaultInputToken,
  defaultOutputToken,
  tokens,
}: SwitchModalContentProps) => {
  const [slippage, setSlippage] = useState<string>('0.10');
  const isWrongNetwork = useIsWrongNetwork(selectedChainId);
  const selectedNetworkConfig = getNetworkConfig(selectedChainId);
  const slippageValidation = validateSlippage(slippage);
  return (
    <>
      <TxModalTitle title="Switch tokens" />
      {isWrongNetwork.isWrongNetwork && (
        <ChangeNetworkWarning
          networkName={selectedNetworkConfig.name}
          chainId={selectedChainId}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row-reverse',
        }}
      >
        <SwitchSlippageSelector
          slippageValidation={slippageValidation}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      </Box>
    </>
  );
};

export default SwitchModalContent;
