import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import EditPage from '@/components/affiliate/tbot-period/edit-page';

const FaqEdit: NextPageWithLayout = () => {
  return <EditPage />;
};

FaqEdit.Layout = MainLayout;

export default FaqEdit;
