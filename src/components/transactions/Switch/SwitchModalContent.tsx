import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import React, { useMemo, useState } from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { useIsWrongNetwork } from '@/hooks/useIsWrongNetwork';
import ChangeNetworkWarning from '../Warnings/ChangeNetworkWarning';
import { SupportedNetworkWithChainId } from './common';
import { getNetworkConfig } from '@/utils/marketsAndNetworksConfig';
import { Box, CircularProgress, IconButton, SvgIcon } from '@mui/material';
import { SwitchSlippageSelector } from './SwitchSlippageSelector';
import SwitchAssetInput from './SwitchAssetInput';
import { SwitchVerticalIcon } from '@heroicons/react/outline';
import { useModalContext } from '@/hooks/useModal';
import { debounce } from 'lodash';
import { useRootStore } from '@/store/root';
interface SwitchModalContentProps {
  selectedChainId: number;
  setSelectedChainId: (value: number) => void;
  supportedNetworks: SupportedNetworkWithChainId[];
  tokens: TokenInfoWithBalance[];
  defaultInputToken: TokenInfoWithBalance;
  defaultOutputToken: TokenInfoWithBalance;
  addNewToken: (token: TokenInfoWithBalance) => Promise<void>;
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
  addNewToken,
}: SwitchModalContentProps) => {
  const [slippage, setSlippage] = useState<string>('0.10');
  const [inputAmount, setInputAmount] = useState('');
  const [debounceInputAmount, setDebounceInputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] =
    useState(defaultInputToken);
  const [selectedOutputToken, setSelectedOutputToken] =
    useState(defaultOutputToken);

  const user = useRootStore((store) => store.account);
  const isWrongNetwork = useIsWrongNetwork(selectedChainId);
  const selectedNetworkConfig = getNetworkConfig(selectedChainId);
  const slippageValidation = validateSlippage(slippage);
  const { txError, setTxError } = useModalContext();

  console.log(selectedInputToken,'selectedInputToken')
  
  const handleInputChange = (value: string) => {
    setTxError(undefined);
    if (value === '-1') {
      setInputAmount(selectedInputToken.balance);
      debouncedInputChange(selectedInputToken.balance);
    } else {
      setInputAmount(value);
      debouncedInputChange(value);
    }
  };

  const debouncedInputChange = useMemo(() => {
    return debounce((value: string) => {
      setDebounceInputAmount(value);
    }, 300);
  }, [setDebounceInputAmount]);

  const handleSelectedInputToken = (token: TokenInfoWithBalance) => {
    if (!tokens.find((t) => t.address === token.address)) {
      addNewToken(token).then(() => {
        setSelectedInputToken(token);
        setTxError(undefined);
      });
    } else {
      setSelectedInputToken(token);
      setTxError(undefined);
    }
  };

  const handleSelectedOutputToken = (token: TokenInfoWithBalance) => {
    if (!tokens.find((t) => t.address === token.address)) {
      addNewToken(token).then(() => {
        setSelectedOutputToken(token);
        setTxError(undefined);
      });
    } else {
      setSelectedOutputToken(token);
      setTxError(undefined);
    }
  };

  const onSwitchReserves = () => {
    const fromToken = selectedInputToken;
    const toToken = selectedOutputToken;
  };

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
          height: '33px',
        }}
      >
        <SwitchSlippageSelector
          slippageValidation={slippageValidation}
          slippage={slippage}
          setSlippage={setSlippage}
        />
      </Box>
      {!selectedInputToken || !selectedOutputToken ? (
        <CircularProgress />
      ) : (
        <>
          <Box
            sx={{
              display: 'flex',
              gap: '15px',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <SwitchAssetInput
              chainId={selectedChainId}
              assets={tokens.filter(
                (token) => token.address !== selectedOutputToken.address,
              )}
              value={inputAmount}
              onChange={handleInputChange}
              usdValue={'0'}
              onSelect={handleSelectedInputToken}
              selectedAsset={selectedInputToken}
            />
            <IconButton
              // onClick={onSwitchReserves}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                position: 'absolute',
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'background.surface' },
              }}
            >
              <SvgIcon
                sx={{
                  color: 'primary.main',
                  fontSize: '18px',
                }}
              >
                <SwitchVerticalIcon />
              </SvgIcon>
            </IconButton>
            <SwitchAssetInput
              chainId={selectedChainId}
              assets={tokens.filter(
                (token) => token.address !== selectedInputToken.address,
              )}
              value={'0'}
              usdValue={'0'}
              // loading={
              //   debounceInputAmount !== '0' &&
              //   debounceInputAmount !== '' &&
              //   ratesLoading &&
              //   !ratesError
              // }
              onSelect={handleSelectedOutputToken}
              disableInput={true}
              selectedAsset={selectedOutputToken}
            />
          </Box>
          {user ? 2222 : 222222}
        </>
      )}
    </>
  );
};

export default SwitchModalContent;
