import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
} from '@mui/material';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import React, { useState } from 'react';
import { moreNavigation } from '@/ui-config/menu-items';
import { Link } from '@/components/primitives/Link';
import { useAccount } from 'wagmi';

const MoreMenu = () => {
  const { address: walletAddress } = useAccount();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const open = Boolean(anchorEl);
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        aria-label="more"
        id="more-button"
        aria-controls={open ? 'more-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          color: '#F1F1F3',
          minWidth: 'unset',
          p: '6px 8px',
          '&:hover': {
            bgcolor: 'rgba(250, 251, 252, 0.08)',
          },
        }}
      >
        More
        <SvgIcon color="inherit" sx={{ ml: 1 }}>
          <DotsHorizontalIcon />
        </SvgIcon>
      </Button>
      <Menu
        id="more-menu"
        anchorEl={anchorEl}
        open={open}
        MenuListProps={{
          'aria-labelledby': 'more-button',
        }}
        onClose={handleClose}
      >
        {moreNavigation.map((item, index) => (
          <MenuItem
            component={Link}
            href={
              item.makeLink ? item.makeLink(walletAddress as string) : item.link
            }
            key={index}
          >
            <ListItemIcon>
              <SvgIcon sx={{ fontSize: '20px' }}>{item.icon}</SvgIcon>
            </ListItemIcon>
            <ListItemText>{item.title}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default MoreMenu;
