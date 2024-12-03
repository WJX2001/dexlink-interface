import { createContext, useContext, useState } from 'react';

export interface ModalArgsType {
  underlyingAsset?: string;
  chainId?: number;
}

export enum ModalType {
  Switch,
}

export interface ModalContextType<T extends ModalArgsType> {
  openSwitch: (underlyingAsset?: string, chainId?: number) => void;
  close: () => void;
  args: T;
  type?: ModalType;
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
        },
        args,
        type,
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
