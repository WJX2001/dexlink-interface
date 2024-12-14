import { TokenInfo } from './TokenList';

export const queryKeysFactory = {
  user: (user: string) => [user],
  tokensBalance: (tokenList: TokenInfo[], chainId: number, user: string) => [
    ...queryKeysFactory.user(user),
    tokenList.map((elem) => elem.address),
    chainId,
    'tokensBalance'
  ],
};
