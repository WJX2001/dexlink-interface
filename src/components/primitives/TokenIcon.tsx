import { Icon, IconProps } from "@mui/material";
import { useState } from "react";
import LazyLoad from 'react-lazy-load';

interface ExternalTokenIconProps extends IconProps {
  symbol: string;
  logoURI?: string;
}

export function ExternalTokenIcon({ symbol, logoURI, ...rest }: ExternalTokenIconProps) {
  const [tokenSymbol, setTokenSymbol] = useState(symbol.toLowerCase());
  return (
    <Icon {...rest} sx={{ display: 'flex', position: 'relative', borderRadius: '50%', ...rest.sx }}>
      <LazyLoad>
        <img
          src={tokenSymbol === 'default' || !logoURI ? '/icons/tokens/default.svg' : logoURI}
          width="100%"
          height="100%"
          alt={`${symbol} icon`}
          onError={() => setTokenSymbol('default')}
        />
      </LazyLoad>
    </Icon>
  );
}