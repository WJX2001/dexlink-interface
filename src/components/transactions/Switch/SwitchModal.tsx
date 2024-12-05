import BasicModal from '@/components/primitives/BasicModal';
import {
  TokenInfoWithBalance,
  useTokensBalance,
} from '@/hooks/generic/useTokenBalance';
import { ModalType, useModalContext } from '@/hooks/useModal';
import { useRootStore } from '@/store/root';
import { TOKEN_LIST, TokenList } from '@/ui-config/TokenList';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import SwitchModalContent from './SwitchModalContent';
import { useWeb3Context } from '@/lib/hooks/useWeb3Context';

interface SwitchModalContentWrapperProps {
  user: string;
  chainId: number;
  setSelectedChainId: (chainId: number) => void;
}

const getFilteredTokens = (
  chainId: number,
  realChainId: number,
  tokenList: TokenList,
): TokenInfoWithBalance[] => {
  let customTokenList = tokenList.tokens;
  const savedCustomTokens = localStorage.getItem('customTokens');
  if (savedCustomTokens) {
    customTokenList = customTokenList.concat(JSON.parse(savedCustomTokens));
  }
  const transformedTokens = customTokenList.map((token) => {
    return { ...token, balance: '0' };
  });
  return transformedTokens.filter((token) => token.chainId === realChainId);
};

const SwitchModalContentWrapper = ({
  user,
  chainId,
  setSelectedChainId,
}: SwitchModalContentWrapperProps) => {
  const realChainId = useRootStore((store) => store.currentChainId);
  const filteredTokens = getFilteredTokens(chainId, realChainId, TOKEN_LIST);
  const baseTokenList = useTokensBalance(filteredTokens, user);
  const { defaultInputToken, defaultOutputToken } = useMemo(() => {
    if (baseTokenList) {
      const defaultInputToken = baseTokenList[0];
      const defaultOutputToken = baseTokenList.find(
        (token) => token.address !== defaultInputToken.address,
      ) as TokenInfoWithBalance;
      return { defaultInputToken, defaultOutputToken };
    }
    return {
      defaultInputToken: filteredTokens[0],
      defaultOutputToken: filteredTokens[1],
    };
  }, [baseTokenList, filteredTokens]);
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
      selectedChainId={chainId}
      setSelectedChainId={setSelectedChainId}
      defaultInputToken={defaultInputToken}
      defaultOutputToken={defaultOutputToken}
      tokens={baseTokenList}
    />
  );
};

export const SwitchModal = () => {
  const { type, close } = useModalContext();
  const { chainId: connectedChainId } = useWeb3Context();
  const { openConnectModal } = useConnectModal();
  // 这个是根据当前部署的网络来决定的 部署在哪个网络就用哪个
  const currentChainId = useRootStore((store) => store.currentChainId);
  const [selectedChainId, setSelectedChainId] = useState<number>();
  const user = useRootStore((store) => store.account);
  /**
   * TODO: 后续根据supportNetworksWithEnabledMarket 进行chainId的配置
   * 这里先临时处理下，暂时只取当前的chainId
   */

  useEffect(() => {
    setSelectedChainId(connectedChainId);
  }, [connectedChainId]);

  return (
    <BasicModal open={type === ModalType.Switch} setOpen={close}>
      {!user ? (
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
