import BasicModal from '@/components/primitives/BasicModal';
import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import { ModalType, useModalContext } from '@/hooks/useModal';
import { useRootStore } from '@/store/root';
import { TOKEN_LIST } from '@/ui-config/TokenList';
import { Box, Button, Typography } from '@mui/material';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

interface SwitchModalContentWrapperProps {
  user: string;
  chainId: number;
  setSelectedChainId: (chainId: number) => void;
}

const getFilteredTokens = (chainId: number): TokenInfoWithBalance[] => {
  // Temporary use once
  const realChainId = useRootStore((store) => store.currentChainId);
  // 这里TOKEN_LIST要换下 换成拿到WETH的结果
  let customTokenList = TOKEN_LIST.tokens;
  const savedCustomTokens = localStorage.getItem('customTokens');
  if (savedCustomTokens) {
    customTokenList = customTokenList.concat(JSON.parse(savedCustomTokens));
  }
  const transformedTokens = customTokenList.map((token) => {
    return { ...token, balance: '0' };
  });
  // TODO: 后续要根据真实的networkId 进行筛选 这里暂时直接返回
  return transformedTokens.filter((token) => token.chainId === realChainId);
};

const SwitchModalContentWrapper = ({
  user,
  chainId,
  setSelectedChainId,
}: SwitchModalContentWrapperProps) => {
  const filteredTokens = useMemo(() => getFilteredTokens(chainId), [chainId]);
  return <div>22222</div>;
};

export const SwitchModal = () => {
  const { type, close } = useModalContext();
  const { address: user, chainId: connectedChainId } = useAccount();
  const { openConnectModal } = useConnectModal();
  const currentChainId = useRootStore((store) => store.currentChainId);
  const [selectedChainId, setSelectedChainId] = useState<number>();

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
