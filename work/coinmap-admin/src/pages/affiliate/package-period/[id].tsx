import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import PackageditPage from '@/components/affiliate/package-period/edit-page';

const PackageEdit: NextPageWithLayout = () => {
  return <PackageditPage />;
};

PackageEdit.Layout = MainLayout;

export default PackageEdit;
