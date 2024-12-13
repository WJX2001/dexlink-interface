import React, { MouseEvent, useState } from 'react';
import { ValidationData } from './SwitchModalContent';
import {
  Box,
  Button,
  InputBase,
  Menu,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { CogIcon } from '@heroicons/react/solid';
import { FormattedNumber } from '@/components/primitives/FormattedNumber';


type SwitchSlippageSelectorProps = {
  slippage: string;
  setSlippage: (value: string) => void;
  slippageValidation?: ValidationData;
};

const DEFAULT_SLIPPAGE_OPTIONS = ['0.10', '0.50', '1.00'];

const SwitchSlippageSelector = ({
  slippage,
  setSlippage,
  slippageValidation,
}: SwitchSlippageSelectorProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>();
  const [isCustomSlippage, setIsCustomSlippage] = useState(false);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePresetSlippageChange = (value: string) => {
    setSlippage(value);
    setIsCustomSlippage(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="caption" color="text.secondary">
        Slippage
        <Menu
          sx={{
            maxWidth: '330px',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          id="switch-slippage-selector"
          MenuListProps={{
            'aria-labelledby': 'switch-slippage-selector-button',
            sx: { py: 3, px: 4 },
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <Typography variant="subheader2" mb={5}>
            Max slippage
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              gap: '8px',
            }}
          >
            <ToggleButtonGroup
              sx={{
                backgroundColor: 'background.surface',
                borderRadius: '6px',
                borderColor: 'background.surface',
              }}
              exclusive
              onChange={(_, value) => handlePresetSlippageChange(value)}
            >
              {DEFAULT_SLIPPAGE_OPTIONS.map((option) => (
                <ToggleButton
                  sx={{
                    borderRadius: 1,
                    py: 1,
                    px: 2,
                    borderWidth: 2,
                    backgroundColor:
                      option === slippage && !isCustomSlippage
                        ? 'background.paper'
                        : 'transparent',
                  }}
                  value={option}
                  key={option}
                >
                  <FormattedNumber
                    value={option}
                    visibleDecimals={2}
                    symbol="%"
                    variant="subheader2"
                    color="primary.main"
                    symbolsColor="primary.main"
                  />
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <InputBase type="percent"/>
          </Box>
        </Menu>
      </Typography>
      <Button
        id="switch-slippage-selector-button"
        sx={{ padding: 0, minWidth: 0 }}
        aria-controls="switch-slippage-selector"
        onClick={handleOpen}
      >
        <SvgIcon sx={{ fontSize: '16px' }}>
          <CogIcon />
        </SvgIcon>
      </Button>
    </Box>
  );
};

export default SwitchSlippageSelector;
