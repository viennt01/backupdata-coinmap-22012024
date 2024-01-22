import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import EditPage from '@/components/affiliate/tbot-fee/edit-page';

const BotFeeEdit: NextPageWithLayout = () => {
  return <EditPage />;
};

BotFeeEdit.Layout = MainLayout;

export default BotFeeEdit;
