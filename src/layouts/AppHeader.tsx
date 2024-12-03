import {
  Badge,
  Box,
  Button,
  NoSsr,
  Slide,
  styled,
  SvgIcon,
  Typography,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import React from 'react';
// import newLogo from '@/assets/newLogo.svg'
// import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Link } from '@/components/primitives/Link';
import { uiConfig } from '@/uiConfig';
import { NavItems } from './components/NavItems';
import SettingsMenu from './SettingMenu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { useModalContext } from '@/hooks/useModal';
// import NavItems from './components/NavItems';
// import styles from './styles/AppHeader.module.less'
// import SettingsMenu from './SettingsMenu';
interface Props {
  children: React.ReactElement;
}

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: '2px',
    right: '2px',
    borderRadius: '20px',
    width: '10px',
    height: '10px',
    backgroundColor: `${theme.palette.secondary.main}`,
    color: `${theme.palette.secondary.main}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

function HideOnScroll({ children }: Props) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const trigger = useScrollTrigger({ threshold: md ? 160 : 80 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const AppHeader = () => {
  const smd = useMediaQuery('(max-width:1120px)');
  const { openSwitch,type } = useModalContext();
  const headerHeight = 48;
  const handleSwitchClick = () => {
    openSwitch()
  };
  console.log(type,'iuy')

  return (
    <HideOnScroll>
      <Box
        component="header"
        sx={(theme) => ({
          height: headerHeight,
          position: 'sticky',
          top: 0,
          transition: theme.transitions.create('top'),
          zIndex: theme.zIndex.appBar,
          bgcolor: theme.palette.background.header,
          padding: {
            xs: '8px 8px 8px 20px',
            xsm: '8px 20px',
          },
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'space-between',
          boxShadow: 'inset 0px -1px 0px rgba(242, 243, 247, 0.16)',
        })}
      >
        <Box
          component={Link}
          href="/"
          aria-label="Go to homepage"
          sx={{
            lineHeight: 0,
            mr: 3,
            transition: '0.3s ease all',
            '&:hover': { opacity: 0.7 },
          }}
          // onClick={() => setMobileMenuOpen(false)}
        >
          <img src={uiConfig.appLogo} alt="AAVE" width={72} height={20} />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <NavItems />
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        <NoSsr>
          <StyledBadge
            invisible={true}
            variant="dot"
            badgeContent=""
            color="secondary"
            sx={{ mr: 2 }}
          >
            <Button
              onClick={handleSwitchClick}
              variant="surface"
              aria-label="Switch tool"
              sx={{
                p: '7px 8px',
                minWidth: 'unset',
                gap: 2,
                alignItems: 'center',
              }}
            >
              {!smd && (
                <Typography component="span" typography="subheader1">
                  Switch tokens
                </Typography>
              )}
              <SvgIcon fontSize="small">
                <SwitchHorizontalIcon />
              </SvgIcon>
            </Button>
          </StyledBadge>
        </NoSsr>
        {/* <Box>
          <ConnectButton />
        </Box> */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <SettingsMenu />
        </Box>
      </Box>
    </HideOnScroll>
  );
};

export default AppHeader;
