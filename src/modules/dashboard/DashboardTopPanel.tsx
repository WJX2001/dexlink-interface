import PageTitle from '@/components/TopInfoPanel/PageTitle';
import TopInfoPanel from '@/components/TopInfoPanel/TopInfoPanel';
import { Box } from '@mui/material';
import React from 'react';

const DashboardTopPanel = () => {
  return (
    <>
      <TopInfoPanel
        titleComponent={
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PageTitle
              pageTitle={<>Dashboard</>}
              withMarketSwitcher={true}
              // bridge={currentNetworkConfig.bridge}
            />
          </Box>
        }
      >
        223423
      </TopInfoPanel>
    </>
  );
};

export default DashboardTopPanel;
