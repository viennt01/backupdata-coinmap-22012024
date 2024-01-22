import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import CreatePage from '@/components/affiliate/tbot-fee/create-page';

const BotFeeCreate: NextPageWithLayout = () => {
  return <CreatePage />;
};

BotFeeCreate.Layout = MainLayout;

export default BotFeeCreate;
