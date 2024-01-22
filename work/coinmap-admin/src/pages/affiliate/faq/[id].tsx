import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import FaqEditPage from '@/components/affiliate/faq/faq-edit-page';

const FaqEdit: NextPageWithLayout = () => {
  return <FaqEditPage />;
};

FaqEdit.Layout = MainLayout;

export default FaqEdit;
