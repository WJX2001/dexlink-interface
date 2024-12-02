import { ROUTES } from "@/components/primitives/Link";
interface Navigation {
  link: string;
  title: string;
  // isVisible?: (data: MarketDataType) => boolean | undefined;
  dataCy?: string;
}

export const navigation: Navigation[] = [
  {
    link: ROUTES.dashboard,
    title: `Dashboard`,
    dataCy: 'menuDashboard',
  },
  {
    link: ROUTES.SWAP,
    title: `Swap`,
    dataCy: 'menuSwap',
  },
  {
    link: ROUTES.LIQUIDITY,
    title: `Liquidity`,
    dataCy: 'menuLiquidity',
  },
  {
    link: ROUTES.INDEX,
    title: `Index`,
    dataCy: 'menuIndex',
  }
  
];