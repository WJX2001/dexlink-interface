import { TokenInfo } from "@/ui-config/TokenList";

export interface TokenInfoWithBalance extends TokenInfo {
  balance: string;
  oracle?: string;
}