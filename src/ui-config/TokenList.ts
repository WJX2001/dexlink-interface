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
export const TMPNETWORK = ChainId.fuji;

export const TOKEN_LIST: TokenList = {
  name: 'Labs Default',
  tokens: [
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0x02823f9B469960Bb3b1de0B3746D4b95B7E35543',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
    {
      name: 'Dai',
      symbol: 'DAI',
      address: '0x51BC2DfB9D12d9dB50C855A5330fBA0faF761D15',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
    {
      name: 'Ethereum',
      symbol: 'ETH',
      address: '0xc156D16E6D3025d3c6df16AcbE75C94975096D98', // Weth address is fetched from the router
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
      address: '0x35c72D6A66B2C8e15d97a3561D24Aa0155bD5b35',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://assets.coingecko.com/coins/images/9519/thumb/paxg.PNG?1568542565',
      extensions: {
        isNative: true,
      },
    },
    {
      name: 'Pearl',
      symbol: 'PEARL',
      address: '0xAc7B5DdC47D23ad480765120d17bF426B858F22a',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://assets.coingecko.com/coins/images/30799/large/Yp9H3agr_400x400.jpg?1696529660',
    },
    {
      name: 'Link',
      symbol: 'LINK',
      address: '0x5701AaF1a3FA52fFF6bDb607D5d58173A8841c00',
      decimals: 18,
      chainId: TMPNETWORK,
      logoURI:
        'https://assets.coingecko.com/coins/images/12738/thumb/AlphaToken_256x256.png?1617160876',
      extensions: {
        isNative: true,
      },
    },
  ],
};

export const COMMON_SWAPS = [
  'ETH',
  'DAI',
  'USDC',
  'USDT',
  'WBTC',
  'WETH',
  'DAI.e',
  'USDC.e',
  'USDT.e',
  'GHO',
];
