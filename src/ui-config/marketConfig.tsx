import { ReactNode } from "react";

// export type MarketDataType = {
//   v3?: boolean;
//   marketTitle: string;
//   market: CustomMarkek;
//   // the network the market operates on
//   chainId: ChainId;
//   enabledFeatures?: {
//     liquiditySwap?: boolean;
//     staking?: boolean;
//     governance?: boolean;
//     faucet?: boolean;
//     collateralRepay?: boolean;
//     incentives?: boolean;
//     permissions?: boolean;
//     debtSwitch?: boolean;
//     withdrawAndSwitch?: boolean;
//     switch?: boolean;
//   };
//   permitDisabled?: boolean; // intended to be used for testnets
//   isFork?: boolean;
//   permissionComponent?: ReactNode;
//   disableCharts?: boolean;
//   subgraphUrl?: string;
//   logo?: string;
//   addresses: {
//     LENDING_POOL_ADDRESS_PROVIDER: string;
//     LENDING_POOL: string;
//     WETH_GATEWAY?: string;
//     SWAP_COLLATERAL_ADAPTER?: string;
//     REPAY_WITH_COLLATERAL_ADAPTER?: string;
//     DEBT_SWITCH_ADAPTER?: string;
//     WITHDRAW_SWITCH_ADAPTER?: string;
//     FAUCET?: string;
//     PERMISSION_MANAGER?: string;
//     WALLET_BALANCE_PROVIDER: string;
//     L2_ENCODER?: string;
//     UI_POOL_DATA_PROVIDER: string;
//     UI_INCENTIVE_DATA_PROVIDER?: string;
//     COLLECTOR?: string;
//     V3_MIGRATOR?: string;
//     GHO_TOKEN_ADDRESS?: string;
//     GHO_UI_DATA_PROVIDER?: string;
//   };
// };