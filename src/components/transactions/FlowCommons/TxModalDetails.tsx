import { Box, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import GasStation from '../GasStation/GasStation';
import { parseUnits } from 'ethers/lib/utils';
import { parseGwei } from 'viem';

export interface TxModalDetailsProps {
  gasLimit?: string;
  slippageSelector?: ReactNode;
  skipLoad?: boolean;
  disabled?: boolean;
  chainId?: number;
  children?: ReactNode;
}

const TxModalDetails: React.FC<TxModalDetailsProps> = ({
  gasLimit,
  slippageSelector,
  skipLoad,
  disabled,
  children,
  chainId,
}) => {
  return (
    <Box sx={{ pt: 5 }}>
      <Typography sx={{ mb: 1 }} color="text.secondary">
        Transaction overview
      </Typography>

      <Box
        sx={(theme) => ({
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          '.MuiBox-root:last-of-type': {
            mb: 0,
          },
        })}
      >
        {children}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <GasStation
          chainId={chainId}
          gasLimit={parseGwei(gasLimit || '0')}
          skipLoad={skipLoad}
          disabled={disabled}
          rightComponent={slippageSelector}
        />
      </Box>
    </Box>
  );
};

export default TxModalDetails;
