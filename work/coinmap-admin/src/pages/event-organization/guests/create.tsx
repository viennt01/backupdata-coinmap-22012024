import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import GuestsCreatePage from '@/components/guests-create-page';

const GuestsCreate: NextPageWithLayout = () => {
  return <GuestsCreatePage />;
};

GuestsCreate.Layout = MainLayout;

export default GuestsCreate;
