import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import PolicyPage from '@/components/affiliate/merchants/merchant-edit-page/policy';

const Policy: NextPageWithLayout = () => {
  return <PolicyPage />;
};

Policy.Layout = MainLayout;

export default Policy;
