import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import MerchantsCreatePage from '@/components/affiliate/merchants/merchant-create-page';

const MerchantsCreate: NextPageWithLayout = () => {
  return <MerchantsCreatePage />;
};

MerchantsCreate.Layout = MainLayout;

export default MerchantsCreate;
