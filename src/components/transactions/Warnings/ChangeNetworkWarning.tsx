import { Warning } from '@/components/primitives/Warining';
import { ChainId } from '@/smart-router/constants/chainIdList';
import { AlertProps, Button, Typography } from '@mui/material';
import { useChainModal } from '@rainbow-me/rainbowkit';
import React from 'react';

export type ChangeNetworkWarningProps = AlertProps & {
  funnel?: string;
  networkName: string;
  chainId: ChainId;
};
const ChangeNetworkWarning = ({
  networkName,
  chainId,
  funnel,
  ...rest
}: ChangeNetworkWarningProps) => {
  const { openChainModal } = useChainModal();
  const handleSwitchNetwork = () => {
    openChainModal && openChainModal();
  };

  return (
    <Warning severity="error" icon={false} {...rest}>
      <Typography variant="description">
        Please switch to {networkName}.{' '}
        <Button
          variant="text"
          sx={{ ml: '2px', verticalAlign: 'top' }}
          onClick={handleSwitchNetwork}
          disableRipple
        >
          <Typography variant="description">Switch Network</Typography>
        </Button>
      </Typography>
    </Warning>
  );
};

export default ChangeNetworkWarning;
