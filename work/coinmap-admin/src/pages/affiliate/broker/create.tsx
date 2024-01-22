import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import CreatePage from '@/components/affiliate/broker/create-page';

const BrokerCreate: NextPageWithLayout = () => {
  return <CreatePage />;
};

BrokerCreate.Layout = MainLayout;

export default BrokerCreate;
