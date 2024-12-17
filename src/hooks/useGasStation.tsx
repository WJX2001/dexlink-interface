
import { GasStationContext } from '@/components/transactions/GasStation/GasStationProvider';
import React from 'react';

export function useGasStation() {
  const context = React.useContext(GasStationContext);
  if (context === undefined) {
    throw new Error('useGasStation must be used within a GasStationProvider');
  }
  return context;
}
