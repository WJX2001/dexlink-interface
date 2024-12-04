import { Box } from '@mui/material';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import merge from 'lodash.merge';
import React from 'react';

const myTheme = merge(
  darkTheme({
    borderRadius: 'small',
  }),
  {
    colors: {
      accentColor: 'linear-gradient(248.86deg, #B6509E 10.51%, #2EBAC6 93.41%)',
      connectButtonBackground: '#383D51',
    },

    radii: {
      actionButton: '0',
    },
  },
);
interface Props {
  children: React.ReactNode;
}

const RainbowKitProviderCustom: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{
      '& > div': {
        height:'100vh',
        display: 'flex',
        flexDirection: 'column',
      }
    }}>
      <RainbowKitProvider locale="en" theme={myTheme}>
        {children}
      </RainbowKitProvider>
    </Box>
  );
};

export default RainbowKitProviderCustom;
