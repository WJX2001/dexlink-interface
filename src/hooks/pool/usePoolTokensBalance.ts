import { UserPoolTokensBalances } from "@/services/WalletBalanceService";
import { MarketDataType } from "@/ui-config/marketConfig";
import { HookOpts } from "../commonTypes";



export const usePoolsTokensBalance = <T = UserPoolTokensBalances[]>(
  marketsData: MarketDataType[],
  user: string,
  opts?: HookOpts<UserPoolTokensBalances[], T>
) => {
  
}