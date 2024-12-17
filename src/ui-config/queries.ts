import { TokenInfo } from './TokenList';

export const queryKeysFactory = {
  user: (user: string) => [user],
  tokensBalance: (tokenList: TokenInfo[], chainId: number, user: string) => [
    ...queryKeysFactory.user(user),
    tokenList.map((elem) => elem.address),
    chainId,
    'tokensBalance',
  ],
  gasPrices: (chainId: number) => [chainId, 'gasPrices'],
  swapRates: (
    chainId: number,
    amount: string,
    srcToken: string,
    destToken: string,
    user: string,
  ) => [
    ...queryKeysFactory.user(user),
    chainId,
    amount,
    srcToken,
    destToken,
    'swapRates',
  ],
};
