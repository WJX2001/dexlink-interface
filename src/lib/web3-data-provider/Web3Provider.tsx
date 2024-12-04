import { ReactElement } from "react";
import { Web3Context } from "../hooks/useWeb3Context";

export type Web3Data = {

}

export const Web3ContextProvider:React.FC<{children: ReactElement}> = ({children}) => {
  return (
    <Web3Context.Provider value={{
      web3ProviderData: {
        wjx: 22222
      }
    }}>
      {children}
    </Web3Context.Provider>
  )
}