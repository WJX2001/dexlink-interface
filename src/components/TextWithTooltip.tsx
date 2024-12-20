import { InformationCircleIcon } from '@heroicons/react/outline';
import {
  Box,
  BoxProps,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography,
} from '@mui/material';
import { TypographyProps } from '@mui/material/Typography';
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  useState,
} from 'react';
import { ContentWithTooltip } from './ContentWithTooltip';

export interface TextWithTooltipProps extends TypographyProps {
  text?: ReactNode;
  icon?: ReactNode;
  iconSize?: number;
  iconColor?: string;
  iconMargin?: number;
  textColor?: string;
  // eslint-disable-next-line
  children?: ReactElement<any, string | JSXElementConstructor<any>>;
  wrapperProps?: BoxProps;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

export const TextWithTooltip = ({
  text,
  icon,
  iconSize = 14,
  iconColor,
  iconMargin,
  children,
  textColor,
  wrapperProps: { sx: boxSx, ...boxRest } = {},
  open: openProp = false,
  setOpen: setOpenProp,
  ...rest
}: TextWithTooltipProps) => {
  const [open, setOpen] = useState(openProp);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...boxSx }} {...boxRest}>
      {text && (
        <Typography {...rest} color={textColor}>
          {text}
        </Typography>
      )}
      <Tooltip
        title={
          <Box
            sx={{
              py: 4,
              px: 6,
              fontSize: '14px',
              lineHeight: '16px',
              a: {
                fontSize: '14px',
                lineHeight: '16px',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              },
            }}
          >
            {children}
          </Box>
        }
      >
        <SvgIcon
          onClick={(e) => {
            console.log(e)
            e.preventDefault()
          }}
          sx={{
            fontSize: iconSize,
            color: iconColor ? iconColor : open ? 'info.main' : 'text.muted',
            borderRadius: '50%',
            '&:hover': { color: iconColor || 'info.main' },
          }}
        >
          {icon || <InformationCircleIcon />}
        </SvgIcon>
      </Tooltip>
    </Box>
  );
};
