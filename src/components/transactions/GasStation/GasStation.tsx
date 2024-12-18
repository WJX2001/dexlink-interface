import { useGasStation } from '@/hooks/useGasStation';
import { useGasPrice } from '@/hooks/useGetGasPrices';
import { useRootStore } from '@/store/root';
import { marketsData } from '@/utils/marketsAndNetworksConfig';
import { Box, Stack } from '@mui/material';
import React, { ReactNode } from 'react';
import invariant from 'tiny-invariant';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
export interface GasStationProps {
  gasLimit: bigint;
  skipLoad?: boolean;
  disabled?: boolean;
  rightComponent?: ReactNode;
  chainId?: number;
}

const GasStation: React.FC<GasStationProps> = ({
  gasLimit,
  skipLoad,
  disabled,
  rightComponent,
  chainId,
}) => {
  const { state } = useGasStation();
  const [currentChainId, account] = useRootStore((store) => [
    store.currentChainId,
    store.account,
  ]);
  const selectedChainId = chainId ?? currentChainId;

  // 这里有两个fuji 测试网 所以临时加白一下取 不为v3版本的
  const marketOnNetwork = Object.values(marketsData)
    .filter((elem) => elem.chainId === selectedChainId)
    .find((elem) => !elem.v3);
  console.log(marketOnNetwork, 'marketOnNetwork');
  invariant(marketOnNetwork, 'No market for this network');
  const { data: gasPrice } = useGasPrice(selectedChainId);

  



  return (
    <Stack gap={6} sx={{ width: '100%' }}>
       <Box sx={{ display: 'flex', mt: 6, justifyContent: 'space-between' }}>
       <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalGasStationIcon color="primary" sx={{ fontSize: '16px', mr: 1.5 }} />
          {/* TODO: 这里仍需完善 */}
          {/* {loadingTxns && !skipLoad ? (
            <CircularProgress color="inherit" size="16px" sx={{ mr: 2 }} />
          ) : totalGasCostsUsd && !disabled ? (
            <>
              <FormattedNumber
                value={totalGasCostsUsd}
                symbol="USD"
                color="text.secondary"
                variant="caption"
              />
              <GasTooltip />
            </>
          ) : (
            '-'
          )} */}
          {
            ('-')
          }
        </Box>
        {rightComponent}
       </Box>
       {/* {!disabled && !isContractAddress && Number(nativeBalanceUSD) < Number(totalGasCostsUsd) && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Warning severity="warning" sx={{ mb: 0, mx: 'auto' }}>
            You do not have enough {baseAssetSymbol} in your account to pay for transaction fees on{' '}
            {name} network. Please deposit {baseAssetSymbol} from another account.
          </Warning>
        </Box>
      )} */}
    </Stack>
  );
};

export default GasStation;
