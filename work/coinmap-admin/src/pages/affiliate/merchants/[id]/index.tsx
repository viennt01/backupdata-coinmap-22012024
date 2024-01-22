import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import MerchantEditPage from '@/components/affiliate/merchants/merchant-edit-page';

const MerchantEdit: NextPageWithLayout = () => {
  return <MerchantEditPage />;
};

MerchantEdit.Layout = MainLayout;

export default MerchantEdit;
