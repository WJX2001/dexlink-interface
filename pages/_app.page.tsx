import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { config } from '../src/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ReactNode, useEffect } from 'react';
import { AppGlobalStyles } from '@/layouts/AppGlobalStyles';
import { Box } from '@mui/material';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};
interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

const client = new QueryClient();
export default function App({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <Box
      sx={{
        '& > div': {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={client}>
          <RainbowKitProvider>
            <AppGlobalStyles>
              {getLayout(<Component {...pageProps} />)}
            </AppGlobalStyles>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Box>
  );
}
