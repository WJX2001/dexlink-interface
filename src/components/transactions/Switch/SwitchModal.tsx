import BasicModal from '@/components/primitives/BasicModal';
import { AaveV3Ethereum } from '@bgd-labs/aave-address-book';
import {
  TokenInfoWithBalance,
  useTokensBalancePlus,
} from '@/hooks/generic/useTokenBalance';
import { ModalType, useModalContext } from '@/hooks/useModal';
import { useRootStore } from '@/store/root';
import { TOKEN_LIST, TokenInfo } from '@/ui-config/TokenList';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useMemo, useState } from 'react';
import SwitchModalContent from './SwitchModalContent';
import { useWeb3Context } from '@/lib/hooks/useWeb3Context';
import { supportedNetworksWithEnabledMarket } from './common';
import { CustomMarket, marketsData } from '@/ui-config/marketConfig';
import { getNetworkConfig } from '@/utils/marketsAndNetworksConfig';
import invariant from 'tiny-invariant';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeysFactory } from '@/ui-config/queries';
import { zeroAddress } from 'viem';
const defaultNetwork = marketsData[CustomMarket.proto_fuji];

interface SwitchModalContentWrapperProps {
  user: string;
  chainId: number;
  setSelectedChainId: (chainId: number) => void;
}

const getFilteredTokens = (chainId: number): TokenInfoWithBalance[] => {
  let customTokenList = TOKEN_LIST.tokens;
  const savedCustomTokens = localStorage.getItem('customTokens');
  if (savedCustomTokens) {
    customTokenList = customTokenList.concat(JSON.parse(savedCustomTokens));
  }
  const transformedTokens = customTokenList.map((token) => {
    return { ...token, balance: '0' };
  });
  const realChainId = getNetworkConfig(chainId).underlyingChainId ?? chainId;
  return transformedTokens.filter((token) => token.chainId === realChainId);
};

const SwitchModalContentWrapper = ({
  user,
  chainId,
  setSelectedChainId,
}: SwitchModalContentWrapperProps) => {
  const filteredTokens = useMemo(() => getFilteredTokens(chainId), [chainId]);
  const queryClient = useQueryClient();
  // obtain the tokenlist with balance
  const { data: baseTokenList } = useTokensBalancePlus(
    filteredTokens,
    chainId,
    user,
  );

  const { defaultInputToken, defaultOutputToken } = useMemo(() => {
    if (baseTokenList) {
      const defaultInputToken =
        baseTokenList.find((token) => token.extensions?.isNative) ||
        baseTokenList[0];
      const defaultOutputToken =
        baseTokenList.find(
          (token) =>
            (token.address === AaveV3Ethereum.ASSETS.GHO.UNDERLYING ||
              token.symbol == 'AAVE') &&
            token.address !== defaultInputToken.address,
        ) ||
        baseTokenList.find(
          (token) => token.address !== defaultInputToken.address,
        );
      invariant(
        defaultInputToken && defaultOutputToken,
        'token list should have at least 2 assets',
      );
      return { defaultInputToken, defaultOutputToken };
    }
    return {
      defaultInputToken: filteredTokens[0],
      defaultOutputToken: filteredTokens[1],
    };
  }, [baseTokenList, filteredTokens]);

  const addNewToken = async (token: TokenInfoWithBalance) => {
    queryClient.setQueryData<TokenInfoWithBalance[]>(
      queryKeysFactory.tokensBalance(filteredTokens, chainId, user),
      (oldData) => {
        if (oldData)
          return [...oldData, token].sort(
            (a, b) => Number(b.balance) - Number(a.balance),
          );
        return [token];
      },
    );
    const customTokens = localStorage.getItem('customTokens');
    const newTokenInfo = {
      address: token.address,
      symbol: token.symbol,
      decimals: token.decimals,
      chainId: token.chainId,
      name: token.name,
      logoURI: token.logoURI,
      extensions: {
        isUserCustom: true,
      },
    };
    if (customTokens) {
      const parsedCustomTokens: TokenInfo[] = JSON.parse(customTokens);
      parsedCustomTokens.push(newTokenInfo);
      localStorage.setItem('customTokens', JSON.stringify(parsedCustomTokens));
    } else {
      localStorage.setItem('customTokens', JSON.stringify([newTokenInfo]));
    }
  };

  if (!baseTokenList) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          my: '60px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <SwitchModalContent
      key={chainId}
      selectedChainId={chainId}
      setSelectedChainId={setSelectedChainId}
      supportedNetworks={supportedNetworksWithEnabledMarket}
      defaultInputToken={defaultInputToken}
      defaultOutputToken={defaultOutputToken}
      tokens={baseTokenList}
      addNewToken={addNewToken}
    />
  );
};

export const SwitchModal = () => {
  const {
    type,
    close,
    args: { chainId },
  } = useModalContext();
  // 这个是根据当前部署的网络来决定的 部署在哪个网络就用哪个
  const currentChainId = useRootStore((store) => store.currentChainId);
  const { chainId: connectedChainId } = useWeb3Context();
  const user = useRootStore((store) => store.account);
  // open connect wallet modal
  const { openConnectModal } = useConnectModal();
  const [selectedChainId, setSelectedChainId] = useState<number>(() => {
    if (
      supportedNetworksWithEnabledMarket.find(
        (elem) => elem.chainId === currentChainId,
      )
    ) {
      return currentChainId;
    }
    return defaultNetwork.chainId;
  });

  useEffect(() => {
    if (
      chainId &&
      supportedNetworksWithEnabledMarket.find(
        (elem) => elem.chainId === chainId,
      )
    ) {
      setSelectedChainId(chainId);
    } else if (
      connectedChainId &&
      supportedNetworksWithEnabledMarket.find(
        (elem) => elem.chainId === connectedChainId,
      )
    ) {
      const supportedFork = supportedNetworksWithEnabledMarket.find(
        (elem) => elem.underlyingChainId === connectedChainId,
      );
      setSelectedChainId(
        supportedFork ? supportedFork.chainId : connectedChainId,
      );
    } else if (
      supportedNetworksWithEnabledMarket.find(
        (elem) => elem.chainId === currentChainId,
      )
    ) {
      setSelectedChainId(currentChainId);
    } else {
      setSelectedChainId(defaultNetwork.chainId);
    }
  }, [connectedChainId, chainId, connectedChainId]);

  return (
    <BasicModal open={type === ModalType.Switch} setOpen={close}>
      {user === zeroAddress ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            mt: 5,
            alignItems: 'center',
          }}
        >
          <Typography
            sx={{ mb: 6, textAlign: 'center' }}
            color="text.secondary"
          >
            Please connect your wallet to be able to switch your tokens.
          </Typography>
          <Button variant="gradient" onClick={openConnectModal}>
            Connect wallet
          </Button>
        </Box>
      ) : (
        <SwitchModalContentWrapper
          user={user}
          chainId={selectedChainId as number}
          setSelectedChainId={setSelectedChainId}
        />
      )}
    </BasicModal>
  );
};
