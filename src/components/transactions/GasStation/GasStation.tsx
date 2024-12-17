import React, { ReactNode } from 'react'

export interface GasStationProps {
  gasLimit: BigNumber;
  skipLoad?: boolean;
  disabled?: boolean;
  rightComponent?: ReactNode;
  chainId?: number;
}

const GasStation = () => {
  return (
    <div>GasStation</div>
  )
}

export default GasStation