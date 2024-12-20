import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import React, { useMemo, useState } from 'react';
import { TxModalTitle } from '../FlowCommons/TxModalTitle';
import { useIsWrongNetwork } from '@/hooks/useIsWrongNetwork';
import ChangeNetworkWarning from '../Warnings/ChangeNetworkWarning';
import { SupportedNetworkWithChainId } from './common';
import { getNetworkConfig } from '@/utils/marketsAndNetworksConfig';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  SvgIcon,
  Typography,
} from '@mui/material';
import { SwitchSlippageSelector } from './SwitchSlippageSelector';
import SwitchAssetInput from './SwitchAssetInput';
import { SwitchVerticalIcon } from '@heroicons/react/outline';
import { useModalContext } from '@/hooks/useModal';
import { debounce } from 'lodash';
import { useRootStore } from '@/store/root';
import { useSwapSellRates } from '@/hooks/useSellRates';
import { normalizeBN, normalize } from '@aave/math-utils';
import { Warning } from '@/components/primitives/Warning';
import { SwitchErrors } from './SwitchErrors';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import SwitchActions from './SwitchActions';
import TxModalDetails from '../FlowCommons/TxModalDetails';
import { Row } from '@/components/primitives/Row';
import { FormattedNumber } from '@/components/primitives/FormattedNumber';
import { formatUnits, zeroAddress } from 'viem';
import { ParaswapErrorDisplay } from '../Warnings/ParaswapErrorDisplay';
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

  const { gasLimit, txError, setTxError } = useModalContext();
  const { openConnectModal } = useConnectModal();
  const user = useRootStore((store) => store.account);
  const isWrongNetwork = useIsWrongNetwork(selectedChainId);
  const selectedNetworkConfig = getNetworkConfig(selectedChainId);
  const slippageValidation = validateSlippage(slippage);

  const safeSlippage =
    slippageValidation &&
    slippageValidation.severity === ValidationSeverity.ERROR
      ? 0
      : Number(slippage) / 100;
  const {
    data: sellRates,
    error: ratesError,
    isFetching: ratesLoading,
  } = useSwapSellRates({
    chainId: selectedChainId,
    amount:
      debounceInputAmount === ''
        ? '0'
        : normalizeBN(
            debounceInputAmount,
            -1 * selectedInputToken.decimals,
          ).toFixed(0),
    srcToken: selectedInputToken.address,
    srcDecimals: selectedInputToken.decimals,
    destToken: selectedOutputToken.address,
    destDecimals: selectedOutputToken.decimals,
    user,
  });

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
    const toInput = sellRates
      ? normalizeBN(sellRates.destAmount, sellRates.destDecimals).toString()
      : '0';
    setSelectedInputToken(toToken);
    setSelectedOutputToken(fromToken);
    setInputAmount(toInput);
    setDebounceInputAmount(toInput);
    setTxError(undefined);
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
              onClick={onSwitchReserves}
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
              value={
                sellRates
                  ? normalizeBN(
                      sellRates?.destAmount,
                      sellRates.destDecimals,
                    ).toString()
                  : '0'
              }
              usdValue={'0'}
              loading={
                debounceInputAmount !== '0' &&
                debounceInputAmount !== '' &&
                ratesLoading &&
                !ratesError
              }
              onSelect={handleSelectedOutputToken}
              disableInput={true}
              selectedAsset={selectedOutputToken}
            />
          </Box>
          {sellRates && user !== zeroAddress && (
            <TxModalDetails gasLimit={gasLimit} chainId={selectedChainId}>
              <Row
                caption={`Minimum ${selectedOutputToken.symbol} received`}
                captionVariant="caption"
              >
                <FormattedNumber
                  compact={false}
                  roundDown={true}
                  variant="caption"
                  value={
                    Number(
                      normalize(sellRates.destAmount, sellRates.destDecimals),
                    ) *
                    (1 - safeSlippage)
                  }
                />
              </Row>
              <Row
                sx={{ mt: 1 }}
                caption={'Minimum USD value received'}
                captionVariant="caption"
              >
                <FormattedNumber
                  symbol="usd"
                  symbolsVariant="caption"
                  variant="caption"
                  value={Number(sellRates.destUSD) * (1 - safeSlippage)}
                />
              </Row>
            </TxModalDetails>
          )}
          {user !== zeroAddress ? (
            <>
              {(selectedInputToken.extensions?.isUserCustom ||
                selectedOutputToken.extensions?.isUserCustom) && (
                <Warning severity="warning" icon={false} sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="caption">
                    You have selected a custom imported token.
                  </Typography>
                </Warning>
              )}
              <SwitchErrors
                ratesError={ratesError}
                balance={selectedInputToken.balance}
                inputAmount={debounceInputAmount}
              />
              {txError && <ParaswapErrorDisplay txError={txError} />}
              <SwitchActions
                isWrongNetwork={isWrongNetwork.isWrongNetwork}
                inputAmount={debounceInputAmount}
                inputToken={selectedInputToken.address}
                outputToken={selectedOutputToken.address}
                inputName={selectedInputToken.name}
                outputName={selectedOutputToken.name}
                slippage={safeSlippage.toString()}
                blocked={
                  !sellRates ||
                  Number(debounceInputAmount) >
                    Number(selectedInputToken.balance) ||
                  user === zeroAddress ||
                  slippageValidation?.severity === ValidationSeverity.ERROR
                }
                chainId={selectedChainId}
                route={sellRates}
              />
            </>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: 4,
                alignItems: 'center',
              }}
            >
              <Typography
                sx={{ mb: 6, textAlign: 'center' }}
                color="text.secondary"
              >
                Please connect your wallet to be able to switch your tokens.
              </Typography>
              <Button variant="gradient" onClick={openConnectModal}>
                Connect wallet
              </Button>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default SwitchModalContent;
