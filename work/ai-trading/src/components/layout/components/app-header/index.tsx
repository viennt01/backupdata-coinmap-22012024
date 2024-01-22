import { useContext } from 'react';
import HeaderAITrading from './ai-trading';
import HeaderATM from './atm';
import { AppContext } from '@/app-context';
import { AppTemplate } from '@/components/layout/interface';

const HEADERS = {
  [AppTemplate.AI_TRADING]: HeaderAITrading,
  [AppTemplate.ATM]: HeaderATM,
};

const AppHeader = () => {
  const { appTheme } = useContext(AppContext);
  const Header = HEADERS[appTheme.template || AppTemplate.AI_TRADING];
  return <Header />;
};

export default AppHeader;
