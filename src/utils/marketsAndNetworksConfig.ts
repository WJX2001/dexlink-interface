import {
  MarketDataType,
  CustomMarket,
  marketsData as _marketsData,
} from '@/ui-config/marketConfig';
import {
  networkConfigs as _networkConfigs,
  BaseNetworkConfig,
} from '@/ui-config/networksConfig';

export const STAGING_ENV = process.env.NEXT_PUBLIC_ENV === 'staging';

export const PROD_ENV = !process.env.NEXT_PUBLIC_ENV || process.env.NEXT_PUBLIC_ENV === 'prod';

export const ENABLE_TESTNET =
  PROD_ENV && global?.window?.localStorage.getItem('testnetsEnabled') === 'true';


// determines if forks should be shown
export const FORK_ENABLED =
  !!process.env.NEXT_PUBLIC_FORK_URL_RPC ||
  global?.window?.localStorage.getItem('forkEnabled') === 'true';
// specifies which network was forked
const FORK_BASE_CHAIN_ID =
  Number(process.env.NEXT_PUBLIC_FORK_BASE_CHAIN_ID) ||
  Number(global?.window?.localStorage.getItem('forkBaseChainId') || 1);
// specifies on which chainId the fork is running
const FORK_CHAIN_ID =
  Number(process.env.NEXT_PUBLIC_FORK_CHAIN_ID) ||
  Number(global?.window?.localStorage.getItem('forkNetworkId') || 3030);
const FORK_RPC_URL =
  process.env.NEXT_PUBLIC_FORK_URL_RPC ||
  global?.window?.localStorage.getItem('forkRPCUrl') ||
  'http://127.0.0.1:8545';
const FORK_WS_RPC_URL =
  process.env.NEXT_PUBLIC_FORK_URL_WS_RPC ||
  global?.window?.localStorage.getItem('forkWsRPCUrl') ||
  'ws://127.0.0.1:8545';

/**
 * Generates network configs based on networkConfigs & fork settings.
 * Forks will have a rpcOnly clone of their underlying base network config.
 */
export const networkConfigs = Object.keys(_networkConfigs).reduce(
  (acc, value) => {
    acc[value] = _networkConfigs[value];
    if (FORK_ENABLED && Number(value) === FORK_BASE_CHAIN_ID) {
      acc[FORK_CHAIN_ID] = {
        ..._networkConfigs[value],
        name: `${_networkConfigs[value].name} Fork`,
        isFork: true,
        privateJsonRPCUrl: FORK_RPC_URL,
        privateJsonRPCWSUrl: FORK_WS_RPC_URL,
        publicJsonRPCUrl: [],
        publicJsonRPCWSUrl: '',
        underlyingChainId: FORK_BASE_CHAIN_ID,
      };
    }
    return acc;
  },
  {} as { [key: string]: BaseNetworkConfig },
);

export const marketsData = Object.keys(_marketsData).reduce((acc, value) => {
  acc[value] = _marketsData[value as keyof typeof CustomMarket];
  if (
    FORK_ENABLED &&
    _marketsData[value as keyof typeof CustomMarket].chainId ===
      FORK_BASE_CHAIN_ID
  ) {
    acc[`fork_${value}`] = {
      ..._marketsData[value as keyof typeof CustomMarket],
      chainId: FORK_CHAIN_ID,
      isFork: true,
    };
  }
  // TODO:
  /**
   * TODO: At present, no other configurations have been made here,
   *       so we will follow the following logic, which is to return directly
   */
  return acc;
}, {} as { [key: string]: MarketDataType });

export function getSupportedChainIds(): number[] {
  return Array.from(
    Object.keys(marketsData)
      .filter((value) => {
        const isTestnet =
          networkConfigs[
            marketsData[value as keyof typeof CustomMarket].chainId
          ].isTestnet;
        if (STAGING_ENV || ENABLE_TESTNET) {
          return isTestnet;
        }
        return !isTestnet;
      })
      .reduce(
        (acc, value) =>
          acc.add(marketsData[value as keyof typeof CustomMarket].chainId),
        new Set<number>(),
      ),
  );
}
