import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Web3Context } from '../hooks/useWeb3Context';
import { useRouterContract } from '@/hooks/useRouterContract';
import { TOKEN_LIST, TokenList } from '@/ui-config/TokenList';
import { getFactoryContract } from '@/utils/contractHelper';
import { Address } from 'viem';

export type Web3Data = {
  tokenList: TokenList;
  wethAddress: string;
  factory: ReturnType<typeof getFactoryContract>;
};

export const Web3ContextProvider: React.FC<{ children: ReactElement }> = ({
  children,
}) => {
  const routerContract = useRouterContract();
  const [tokenList, setTokenList] = useState<TokenList>(TOKEN_LIST);
  const [wethAddress, setWethAddress] = useState<string>('');
  const [factoryContractInstance, setFactoryContractInstance] =
    useState<ReturnType<typeof getFactoryContract>>();
  const getWethAddress = useCallback(async () => {
    const wethAddress = (await routerContract?.read?.WETH()) as string;
    setWethAddress(wethAddress);
    const factory_address = (await routerContract?.read.factory()) as Address;
    const factoryContract = getFactoryContract(factory_address);
    setFactoryContractInstance(factoryContract);
    setTokenList((prev) => ({
      ...prev,
      tokens: prev.tokens.map((token) =>
        token.symbol === 'ETH' ? { ...token, address: wethAddress } : token,
      ),
    }));
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
          tokenList,
          factory: factoryContractInstance as any,
          wethAddress,
        },
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
