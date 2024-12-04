import { Box } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const ConnectWallletButton = () => {
  return (
    <Box
      sx={{
        '& > div > button': {
          height: '35px !important',
        },
      }}
    >
      <ConnectButton
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
      />
    </Box>
  );
};

export default ConnectWallletButton;
