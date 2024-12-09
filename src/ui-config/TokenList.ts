import { ChainId } from '@/smart-router/constants/chainIdList';
import { zeroAddress } from 'viem';
type ExtensionValue = string | number | boolean | null | undefined;
export interface TokenInfo {
  readonly name: string;
  readonly chainId: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly decimals: number;
  readonly address: string;
  readonly extensions?: {
    readonly [key: string]:
      | {
          [key: string]:
            | {
                [key: string]: ExtensionValue;
              }
            | ExtensionValue;
        }
      | ExtensionValue;
  };
}

export interface TokenList {
  readonly name: string;
  tokens: TokenInfo[];
}


// TODO: 这里临时定位linea_test
export const TMPNETWORK = ChainId.linea_testnet

export const TOKEN_LIST: TokenList = {
  name: 'Labs Default',
  tokens: [
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0xC4D9ADD7063F520596AEAD39888bAe8af0B10a31',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      address: '0x416Ec59418c50867a3A26dD9FB84A117744B31F2',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0x10253594A832f967994b44f33411940533302ACb', // Weth address is fetched from the router
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      extensions: {
        isNative: true,
      },
    },
    {
      name: 'Gold',
      symbol: 'GLD',
      address: '0x8a30F2D0b38a70b7aD3A9A1Cf1010537B6129e43',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://assets.coingecko.com/coins/images/9519/thumb/paxg.PNG?1568542565',
    },
    {
      name: 'Pearl',
      symbol: 'PEARL',
      address: '0xe411e046b42760FA917401d0B83EAb48197e452B',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://assets.coingecko.com/coins/images/30799/large/Yp9H3agr_400x400.jpg?1696529660',
    },
    {
      name: 'Link',
      symbol: 'LINK',
      address: '0xc55ECc3c35cc30c650b6b67E3DA9A9c3BF3c5046',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://assets.coingecko.com/coins/images/12738/thumb/AlphaToken_256x256.png?1617160876',
    },
  ],
};
