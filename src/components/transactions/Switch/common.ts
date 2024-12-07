import { marketsData } from '@/ui-config/marketConfig';
import { BaseNetworkConfig } from '@/ui-config/networksConfig';
import {
  getSupportedChainIds,
  networkConfigs,
} from '@/utils/marketsAndNetworksConfig';

export interface SupportedNetworkWithChainId extends BaseNetworkConfig {
  chainId: number;
}

export const supportedNetworksConfig: SupportedNetworkWithChainId[] =
  getSupportedChainIds().map((chainId) => ({
    ...networkConfigs[chainId],
    chainId,
  }));

export const supportedNetworksWithEnabledMarket =
  supportedNetworksConfig.filter((elem) =>
    Object.values(marketsData).find(
      (market) =>
        market.chainId === elem.chainId && market.enabledFeatures?.switch,
    ),
  );
