import React, { createContext } from 'react';

interface SharedDependenciesContext {
  poolTokensBalanceService: any
}

const SharedDependenciesContext =
  createContext<SharedDependenciesContext | null>(null);

interface Props {
  children: React.ReactNode;
}
export const SharedDependenciesProvider: React.FC<Props> = ({children}) => {

  // const poolTokensBalanceService = new WalletBalanceService(getProvider);
  const poolTokensBalanceService = 1111
  return (
    <SharedDependenciesContext.Provider value={{poolTokensBalanceService}}>
      {children}
    </SharedDependenciesContext.Provider>
  )
};
