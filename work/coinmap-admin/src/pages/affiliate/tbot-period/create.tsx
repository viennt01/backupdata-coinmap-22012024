import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import CreatePage from '@/components/affiliate/tbot-period/create-page';

const BotPeriodCreate: NextPageWithLayout = () => {
  return <CreatePage />;
};

BotPeriodCreate.Layout = MainLayout;

export default BotPeriodCreate;
