import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Web3Context } from '../hooks/useWeb3Context';
import { useRouterContract } from '@/hooks/useRouterContract';
import { TOKEN_LIST, TokenList } from '@/ui-config/TokenList';
import { getFactoryContract } from '@/utils/contractHelper';
import { Address } from 'viem';
import { useAccount, useChainId } from 'wagmi';
import { useRootStore } from '@/store/root';

export type Web3Data = {
  factoryAddress: string;
  chainId: number;
  readOnlyModeAddress: string | undefined;
  readOnlyMode: boolean;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const chainId = useChainId();
  const { address: account } = useAccount();
  const routerContract = useRouterContract();
  const [factoryAddress, setFactoryAddress] = useState<string>('');
  const [readOnlyMode, setReadOnlyMode] = useState(false);
  const setAccount = useRootStore((store) => store.setAccount);
  const getWethAddress = useCallback(async () => {
    const factory_address = (await routerContract?.read.factory()) as Address;
    setFactoryAddress(factory_address);
  }, [routerContract]);

  useEffect(() => {
    if (routerContract) {
      getWethAddress();
    }
  }, [routerContract]);

  useEffect(() => {
    setAccount(account);
  }, [account]);

  return (
    <Web3Context.Provider
      value={{
        web3ProviderData: {
          chainId: chainId || 1,
          factoryAddress,
          readOnlyModeAddress: readOnlyMode
            ? account?.toLowerCase()
            : undefined,
          readOnlyMode,
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
