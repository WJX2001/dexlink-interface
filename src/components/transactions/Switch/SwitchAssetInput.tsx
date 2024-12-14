import { ERC20_ABI } from '@/abis/Erc20';
import { FormattedNumber } from '@/components/primitives/FormattedNumber';
import { ExternalTokenIcon } from '@/components/primitives/TokenIcon';
import { SearchInput } from '@/components/SearchInput';
import { TokenInfoWithBalance } from '@/hooks/generic/useTokenBalance';
import { useToken } from '@/hooks/Token';
import { COMMON_SWAPS } from '@/ui-config/TokenList';
import { getErc20Contract } from '@/utils/contractHelper';
import { ExclamationIcon } from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  ListItemText,
  Menu,
  MenuItem,
  SvgIcon,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';
import { formatUnits, isAddress } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
  value: string;
}

export const NumberFormatCustom = React.forwardRef<
  NumberFormatProps,
  CustomProps
>(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        if (values.value !== props.value)
          onChange({
            target: {
              name: props.name,
              value: values.value || '',
            },
          });
      }}
      thousandSeparator
      isNumericString
      allowNegative={false}
    />
  );
});

export interface AssetInputProps {
  value: string;
  usdValue: string;
  chainId: number;
  onChange?: (value: string) => void;
  disabled?: boolean;
  disableInput?: boolean;
  onSelect?: (asset: TokenInfoWithBalance) => void;
  assets: TokenInfoWithBalance[];
  maxValue?: string;
  isMaxSelected?: boolean;
  loading?: boolean;
  selectedAsset: TokenInfoWithBalance;
}

const SwitchAssetInput = ({
  value,
  usdValue,
  onChange,
  disabled,
  disableInput,
  onSelect,
  assets,
  maxValue,
  isMaxSelected,
  loading = false,
  chainId,
  selectedAsset,
}: AssetInputProps) => {
  const theme = useTheme();
  const { address: userAddress } = useAccount();
  const inputRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filteredAssets, setFilteredAssets] = useState(assets);
  const [loadingNewAsset, setLoadingNewAsset] = useState(false);
  const open = Boolean(anchorEl);
  const popularAssets = assets.filter((asset) =>
    COMMON_SWAPS.includes(asset.symbol),
  );

  // const { chainId } = useActiveChainId()
  const handleClick = () => {
    setAnchorEl(inputRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
    handleCleanSearch();
  };

  const handleCleanSearch = () => {
    setFilteredAssets(assets);
    setLoadingNewAsset(false);
  };

  const handleSelect = (asset: TokenInfoWithBalance) => {
    console.log('345', asset);
    onSelect && onSelect(asset);
    onChange && onChange('');
    handleClose();
  };

  const handleSearchAssetChange = async(value: string) => {
    const searchQuery = value.trim().toLowerCase();
    const matchingAssets = assets.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(searchQuery) ||
        asset.name.toLowerCase().includes(searchQuery) ||
        asset.address.toLowerCase() === searchQuery,
    );
    // TODO: 后续还需要添加 自定义token 功能
    if (matchingAssets.length === 0 && isAddress(value)) {
      setLoadingNewAsset(true);
      const erc20Contract = getErc20Contract(value);
      Promise.all([
        erc20Contract?.read?.decimals(),
        erc20Contract?.read?.symbol(),
        erc20Contract?.read?.name(),
        erc20Contract?.read?.balanceOf([userAddress as any]),
      ])
        .then(([decimals, symbol, name, balance]) => {
          const tokenInfo = {
            chainId: chainId,
            balance: formatUnits(balance, decimals),
            extensions: {
              isUserCustom: true,
            },
            symbol,
            name,
            decimals,
            address: value,
          };
          setFilteredAssets([tokenInfo]);
        })
        .catch((e) => {
          setFilteredAssets([]);
        })
        .finally(() => setLoadingNewAsset(false));
    } else {
      setFilteredAssets(matchingAssets);
    }
  };

  return (
    <Box
      ref={inputRef}
      sx={(theme) => ({
        p: '8px 12px',
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: '6px',
        width: '100%',
        mb: 1,
      })}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        {loading ? (
          <Box sx={{ flex: 1 }}>
            <CircularProgress color="inherit" size="16px" />
          </Box>
        ) : (
          <InputBase
            sx={{ flex: 1 }}
            placeholder="0.00"
            disabled={disabled || disableInput}
            value={value}
            autoFocus
            onChange={(e) => {
              if (!onChange) return;
              if (Number(e.target.value) > Number(maxValue)) {
                onChange('-1');
              } else {
                onChange(e.target.value);
              }
            }}
            inputProps={{
              'aria-label': 'amount input',
              style: {
                fontSize: '21px',
                lineHeight: '28,01px',
                padding: 0,
                height: '28px',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              },
            }}
            // eslint-disable-next-line
            inputComponent={NumberFormatCustom as any}
          />
        )}
        {value !== '' && !disableInput && (
          <IconButton
            sx={{
              minWidth: 0,
              p: 0,
              left: 8,
              zIndex: 1,
              color: 'text.muted',
              '&:hover': {
                color: 'text.secondary',
              },
            }}
            onClick={() => {
              onChange && onChange('');
            }}
            disabled={disabled}
          >
            <XCircleIcon height={16} />
          </IconButton>
        )}
        <Button
          disableRipple
          onClick={handleClick}
          data-cy={`assetSelect`}
          sx={{ p: 0, '&:hover': { backgroundColor: 'transparent' } }}
          endIcon={open ? <ExpandLess /> : <ExpandMore />}
        >
          <ExternalTokenIcon
            symbol={selectedAsset.symbol}
            logoURI={selectedAsset.logoURI}
            sx={{ mr: 2, ml: 3 }}
          />
          <Typography
            data-cy={`assetsSelectedOption_${selectedAsset.symbol.toUpperCase()}`}
            variant="main16"
            color="text.primary"
          >
            {selectedAsset.symbol}
          </Typography>
          {selectedAsset.extensions?.isUserCustom && (
            <SvgIcon sx={{ fontSize: 14, ml: 1 }} color="warning">
              <ExclamationIcon />
            </SvgIcon>
          )}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: inputRef.current?.offsetWidth,
              border:
                theme.palette.mode === 'dark' ? '1px solid #EBEBED1F' : 'unset',
              boxShadow: '0px 2px 10px 0px #0000001A',
              overflow: 'hidden',
            },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box
            sx={{
              p: 2,
              px: 3,
              borderBottom: `1px solid ${theme.palette.divider}`,
              top: 0,
              zIndex: 2,
            }}
          >
            <SearchInput
              onSearchTermChange={handleSearchAssetChange}
              placeholder="Search name or paste address"
              disableFocus={true}
            />
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                overfloyY: 'auto',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                mt: 2,
                gap: 2,
              }}
            >
              {popularAssets.map((asset) => (
                <Box
                  key={asset.symbol}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    p: 1,
                    borderRadius: '16px',
                    border: '1px solid',
                    borderColor: theme.palette.divider,
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.palette.divider,
                    },
                  }}
                  onClick={() => handleSelect(asset)}
                >
                  <ExternalTokenIcon
                    logoURI={asset.logoURI}
                    symbol={asset.symbol}
                    sx={{ width: 24, height: 24, mr: 1 }}
                  />
                  <Typography
                    variant="main14"
                    color="text.primary"
                    sx={{ mr: 1 }}
                  >
                    {asset.symbol}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ overflow: 'auto', maxHeight: '200px' }}>
            {loadingNewAsset ? (
              <Box
                sx={{
                  maxHeight: '178px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '60px',
                }}
              >
                <CircularProgress sx={{ mx: 'auto', my: 'auto' }} />
              </Box>
            ) : filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <MenuItem
                  key={asset.symbol}
                  value={asset.symbol}
                  data-cy={`assetsSelectOption_${asset.symbol.toUpperCase()}`}
                  sx={{
                    backgroundColor: theme.palette.background.paper,
                  }}
                  onClick={() => handleSelect(asset)}
                >
                  <ExternalTokenIcon
                    symbol={asset.symbol}
                    logoURI={asset.logoURI}
                    sx={{ mr: 2 }}
                  />
                  <ListItemText sx={{ flexGrow: 0 }}>
                    {asset.symbol}
                  </ListItemText>
                  {asset.extensions?.isUserCustom && (
                    <SvgIcon sx={{ fontSize: 14, ml: 1 }} color="warning">
                      <ExclamationIcon />
                    </SvgIcon>
                  )}
                  {/* {asset.balance && (
                    <FormattedNumber
                      sx={{ ml: 'auto' }}
                      value={asset.balance}
                      compact
                    />
                  )} */}
                </MenuItem>
              ))
            ) : (
              <Typography
                variant="main14"
                color="text.primary"
                sx={{ width: 'auto', textAlign: 'center', m: 4 }}
              >
                No results found. You can import a custom token with a contract
                address
              </Typography>
            )}
          </Box>
        </Menu>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', height: '16px' }}>
        {loading ? (
          <Box sx={{ flex: 1 }} />
        ) : (
          <FormattedNumber
            value={isNaN(Number(usdValue)) ? 0 : Number(usdValue)}
            compact
            symbol="USD"
            variant="secondary12"
            color="text.muted"
            symbolsColor="text.muted"
            flexGrow={1}
          />
        )}

        {selectedAsset.balance && onChange && (
          <>
            <Typography
              component="div"
              variant="secondary12"
              color="text.secondary"
            >
              Balance
              <FormattedNumber
                value={selectedAsset.balance}
                compact
                variant="secondary12"
                color="text.secondary"
                symbolsColor="text.disabled"
                sx={{ ml: 1 }}
              />
            </Typography>
            {!disableInput && (
              <Button
                size="small"
                sx={{ minWidth: 0, ml: '7px', p: 0 }}
                onClick={() => {
                  onChange('-1');
                }}
                disabled={disabled || isMaxSelected}
              >
                Max
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SwitchAssetInput;
