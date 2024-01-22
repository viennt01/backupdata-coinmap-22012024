import { useContext } from 'react';
import FooterAITrading from './ai-trading';
import FooterATM from './atm';
import { AppContext } from '@/app-context';
import { AppTemplate } from '@/components/layout/interface';

const FOOTERS = {
  [AppTemplate.AI_TRADING]: FooterAITrading,
  [AppTemplate.ATM]: FooterATM,
};

const AppFooter = () => {
  const { appTheme } = useContext(AppContext);
  const Footer = FOOTERS[appTheme.template || AppTemplate.AI_TRADING];
  return <Footer />;
};

export default AppFooter;
