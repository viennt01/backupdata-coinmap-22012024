import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import EditPage from '@/components/affiliate/broker/edit-page';

const BrokerEdit: NextPageWithLayout = () => {
  return <EditPage />;
};

BrokerEdit.Layout = MainLayout;

export default BrokerEdit;
