import { Warning } from '@/components/primitives/Warning';
import { Typography } from '@mui/material';



interface ParaswapRatesErrorProps {
  error: unknown;
}

export const ParaswapRatesError = ({ error }: ParaswapRatesErrorProps) => {
  return (
    <Warning severity="error" icon={false} sx={{ mt: 4 }}>
      <Typography variant="caption">
        {/* {error instanceof Error
          ? convertParaswapErrorMessage(error.message)
          : 'There was an issue fetching data from Paraswap'} */}
          There was an issue fetching data from routerContract
      </Typography>
    </Warning>
  );
};
