import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  getContract as viemGetContract,
} from 'viem';

import { IUNISWAP_V2_FACTORY_ABI } from '@/abis/IUniswapV2Factory';
import { TMPNETWORK } from '@/ui-config/TokenList';
import { viemClients } from '@/config/viem';

export const getContract = <
  TAbi extends Abi | readonly unknown[],
  TWalletClient extends WalletClient,
>({
  abi,
  address,
  chainId = TMPNETWORK,
  signer,
}: {
  abi: TAbi | readonly unknown[];
  address: Address;
  chainId?: number;
  signer?: TWalletClient;
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: viemClients(chainId),
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>;
  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  };
};

export const getFactoryContract = (address: Address, signer?: WalletClient) => {
  return getContract({ abi: IUNISWAP_V2_FACTORY_ABI, address, signer });
};
