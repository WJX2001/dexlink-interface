import { ROUTES } from "@/components/primitives/Link";
import { BookOpenIcon, QuestionMarkCircleIcon,CashIcon, CreditCardIcon } from "@heroicons/react/outline";
import { ReactNode } from "react";
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
  },
];

interface MoreMenuItem extends Navigation {
  icon?: ReactNode;
  makeLink?: (walletAddress: string) => string;
}

const moreMenuItems: MoreMenuItem[] = [
  {
    link: ROUTES.STAKE,
    title: `Stake`,
    icon: <CreditCardIcon />
  },
  {
    link: ROUTES.LOAN,
    title: `Loan`,
    icon: <CashIcon />
  },
  // {
  //   link: 'https://docs.aave.com/faq/',
  //   title: `FAQ`,
  //   icon: <QuestionMarkCircleIcon />,
  // },
  // {
  //   link: 'https://docs.aave.com/portal/',
  //   title: `Developers`,
  //   icon: <BookOpenIcon />,
  // },
  
];

export const moreNavigation: MoreMenuItem[] = [...moreMenuItems];