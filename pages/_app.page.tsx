import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { config } from '../src/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { AppGlobalStyles } from '@/layouts/AppGlobalStyles';
import '@rainbow-me/rainbowkit/styles.css';
import { ModalContextProvider } from '@/hooks/useModal';
import dynamic from 'next/dynamic';
import RainbowKitProviderCustom from '@/lib/rainboKit-provider';
type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};
interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}
const client = new QueryClient();

const SwitchModal = dynamic(() =>
  import('@/components/transactions/Switch/SwitchModal').then(
    (module) => module.SwitchModal,
  ),
);

export default function App({ Component, pageProps }: MyAppProps) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProviderCustom>
          <AppGlobalStyles>
            <ModalContextProvider>
              {getLayout(<Component {...pageProps} />)}
              <SwitchModal />
            </ModalContextProvider>
          </AppGlobalStyles>
        </RainbowKitProviderCustom>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
