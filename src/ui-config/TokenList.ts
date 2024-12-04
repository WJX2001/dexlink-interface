import { zeroAddress } from 'viem';

export interface TokenInfo {
  readonly name: string;
  readonly chainId: number;
  readonly symbol: string;
  readonly logoURI?: string;
  readonly decimals: number;
  address: string;
}

export interface TokenList {
  readonly name: string;
  tokens: TokenInfo[];
}

export const LINEACHAINID = 59141;

export const TOKEN_LIST: TokenList = {
  name: 'Labs Default',
  tokens: [
    {
      name: 'Tether USD',
      symbol: 'USDT',
      address: '0xC4D9ADD7063F520596AEAD39888bAe8af0B10a31',
      decimals: 18,
      chainId: LINEACHAINID,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
    // {
    //   name: 'Pocket Index',
    //   symbol: 'PocketIndex',
    //   address: '0xaD3D248B510C23F71915BBf73C6ce6a1b620F8d3',
    //   decimals: 18,
    //   chainId: LINEACHAINID,
    //   logoURI:
    //     'https://coin-images.coingecko.com/coins/images/31696/large/POKT.jpg?1703257336',
    // },
    // {
    //   name: 'Ether',
    //   symbol: 'ETH',
    //   address: zeroAddress, // Weth address is fetched from the router
    //   decimals: 18,
    //   chainId: LINEACHAINID,
    //   logoURI:
    //     'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    // },
    {
      name: 'Dai',
      symbol: 'DAI',
      address: '0x416Ec59418c50867a3A26dD9FB84A117744B31F2',
      decimals: 18,
      chainId: LINEACHAINID,
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    },
    {
      name: 'Gold',
      symbol: 'GLD',
      address: '0x8a30F2D0b38a70b7aD3A9A1Cf1010537B6129e43',
      decimals: 18,
      chainId: LINEACHAINID,
      logoURI:
        'https://assets.coingecko.com/coins/images/9519/thumb/paxg.PNG?1568542565',
    },
    {
      name: 'Pearl',
      symbol: 'PEARL',
      address: '0xe411e046b42760FA917401d0B83EAb48197e452B',
      decimals: 18,
      chainId: LINEACHAINID,
      logoURI:
        'https://assets.coingecko.com/coins/images/30799/large/Yp9H3agr_400x400.jpg?1696529660',
    },
    {
      name: 'Link',
      symbol: 'LINK',
      address: '0xc55ECc3c35cc30c650b6b67E3DA9A9c3BF3c5046',
      decimals: 18,
      chainId: LINEACHAINID,
      logoURI:
        'https://assets.coingecko.com/coins/images/12738/thumb/AlphaToken_256x256.png?1617160876',
    },
  ],
};
