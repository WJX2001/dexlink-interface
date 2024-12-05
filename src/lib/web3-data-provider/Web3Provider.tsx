import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Web3Context } from '../hooks/useWeb3Context';
import { useRouterContract } from '@/hooks/useRouterContract';
import { TOKEN_LIST, TokenList } from '@/ui-config/TokenList';
import { getFactoryContract } from '@/utils/contractHelper';
import { Address } from 'viem';
import { useChainId } from 'wagmi';

export type Web3Data = {
  factoryAddress: string;
  chainId: number;

};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const chainId = useChainId();
  const routerContract = useRouterContract();
  const [factoryAddress, setFactoryAddress] = useState<string>('');

  const getWethAddress = useCallback(async () => {
    const factory_address = (await routerContract?.read.factory()) as Address;
    setFactoryAddress(factory_address);
  }, [routerContract]);

  useEffect(() => {
    if (routerContract) {
      getWethAddress();
    }
  }, [routerContract]);

  return (
    <Web3Context.Provider
      value={{
        web3ProviderData: {
          chainId,
          factoryAddress,

        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
