import { useRootStore } from '@/store/root';
import { MarketDataType } from '@/ui-config/marketConfig';

export interface WalletBalance {
  amount: string;
  amountUSD: string;
}

export interface WalletBalancesMap {
  [address: string]: WalletBalance;
}

export interface WalletBalances {
  walletBalances: WalletBalancesMap;
  hasEmptyWallet: boolean;
  loading: boolean;
}

export const usePoolsWalletBalance = (marketDatas: MarketDataType[]) => {
  const user = useRootStore((store) => store.account);
};

export const useWalletBalances = (marketData: MarketDataType) => {};
