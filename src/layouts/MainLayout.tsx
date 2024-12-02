import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';
import { AppFooter } from './AppFooter';
// import AnalyticsConsent from 'src/components/Analytics/AnalyticsConsent';
// import { FeedbackModal } from 'src/layouts/FeedbackDialog';
// import { FORK_ENABLED } from 'src/utils/marketsAndNetworksConfig';

// import { AppFooter } from './AppFooter';
// import { AppHeader } from './AppHeader';
// import TopBarNotify from './TopBarNotify';

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppHeader />
      <Box
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}
      >
        {children}
      </Box>
      <AppFooter />
    </>
  );
}
