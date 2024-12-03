import BasicModal from '@/components/primitives/BasicModal';
import { ModalType, useModalContext } from '@/hooks/useModal';
import { Box, Button, Typography } from '@mui/material';
import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
export const SwitchModal = () => {
  const { type, close } = useModalContext();
  const { address: user } = useAccount();
  const { openConnectModal } = useConnectModal();
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
       "你来了"
      )}
    </BasicModal>
  );
};
