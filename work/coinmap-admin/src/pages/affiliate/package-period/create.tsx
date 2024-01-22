import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import PackagePeriodCreatePage from '@/components/affiliate/package-period/create-page';

const PackagePeriodCreate: NextPageWithLayout = () => {
  return <PackagePeriodCreatePage />;
};

PackagePeriodCreate.Layout = MainLayout;

export default PackagePeriodCreate;
