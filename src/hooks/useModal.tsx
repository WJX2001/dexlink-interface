import { TxErrorType } from '@/ui-config/errorMapping';
import { createContext, useContext, useState } from 'react';

export interface ModalArgsType {
  underlyingAsset?: string;
  chainId?: number;
}

export type TxStateType = {
  txHash?: string;
  // txError?: string;
  loading?: boolean;
  success?: boolean;
};

export enum ModalType {
  Switch,
}

export interface ModalContextType<T extends ModalArgsType> {
  openSwitch: (underlyingAsset?: string, chainId?: number) => void;
  close: () => void;
  args: T;
  type?: ModalType;
  txError: TxErrorType | undefined;
  setTxError: (error: TxErrorType | undefined) => void;
  gasLimit: string;
  setGasLimit: (limit: string) => void;
  approvalTxState: TxStateType;
  setApprovalTxState: (data: TxStateType) => void;
  loadingTxns: boolean;
  setLoadingTxns: (loading: boolean) => void;
}

interface ModalContextProviderProps {
  children: React.ReactNode;
}

// modalContext
export const ModalContext = createContext<ModalContextType<ModalArgsType>>(
  {} as ModalContextType<ModalArgsType>,
);

// modalContext probider
export const ModalContextProvider: React.FC<ModalContextProviderProps> = ({
  children,
}) => {
  const [args, setArgs] = useState<ModalArgsType>({});
  const [type, setType] = useState<ModalType>();
  const [txError, setTxError] = useState<TxErrorType>();
  const [gasLimit, setGasLimit] = useState<string>('');
  const [approvalTxState, setApprovalTxState] = useState<TxStateType>({});
  const [loadingTxns, setLoadingTxns] = useState(false);
  return (
    <ModalContext.Provider
      value={{
        openSwitch: (underlyingAsset, chainId) => {
          setType(ModalType.Switch);
          setArgs({ underlyingAsset, chainId });
        },
        close: () => {
          setType(undefined);
          setArgs({});
          setApprovalTxState({});
          setGasLimit('');
          setTxError(undefined);
        },
        args,
        type,
        txError,
        setTxError,
        gasLimit,
        setGasLimit,
        approvalTxState,
        setApprovalTxState,
        loadingTxns,
        setLoadingTxns,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }

  return context;
};
