import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import FaqCreatePage from '@/components/affiliate/faq/faq-create-page';

const FaqCreate: NextPageWithLayout = () => {
  return <FaqCreatePage />;
};

FaqCreate.Layout = MainLayout;

export default FaqCreate;
