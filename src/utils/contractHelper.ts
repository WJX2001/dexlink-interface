import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  getContract as viemGetContract,
} from 'viem';
import { viemClients } from './viem';
import { LINEACHAINID } from '@/ui-config/TokenList';
import { IUNISWAP_V2_FACTORY_ABI } from '@/abis/IUniswapV2Factory';

export const getContract = <
  TAbi extends Abi | readonly unknown[],
  TWalletClient extends WalletClient,
>({
  abi,
  address,
  chainId = LINEACHAINID,
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
