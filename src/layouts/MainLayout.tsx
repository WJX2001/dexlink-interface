import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';
// import AnalyticsConsent from 'src/components/Analytics/AnalyticsConsent';
// import { FeedbackModal } from 'src/layouts/FeedbackDialog';
// import { FORK_ENABLED } from 'src/utils/marketsAndNetworksConfig';

// import { AppFooter } from './AppFooter';
// import { AppHeader } from './AppHeader';
// import TopBarNotify from './TopBarNotify';

export function MainLayout({ children }: { children: ReactNode }) {

  return (
    <>
      {/* <TopBarNotify
        learnMoreLink="/markets/?marketName=proto_mainnet_v3"
        notifyText="Merit incentives are available for users who both supply cbBTC and borrow USDC."
        bannerVersion={APP_BANNER_VERSION}
      />
      <AppHeader />
      <Box component="main" sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </Box>

      <AppFooter />
      <FeedbackModal />
      {FORK_ENABLED ? null : <AnalyticsConsent />} */}
      <AppHeader />
      <Box
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {children}
      </Box>
    </>
  );
}
