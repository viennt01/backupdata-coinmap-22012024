import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import GuestsEditPage from '@/components/guests-edit-page';

const GuestsEdit: NextPageWithLayout = () => {
  return <GuestsEditPage />;
};

GuestsEdit.Layout = MainLayout;

export default GuestsEdit;
