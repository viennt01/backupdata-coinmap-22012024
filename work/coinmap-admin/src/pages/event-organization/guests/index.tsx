import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import GuestsPage from '@/components/guests-page';

const Guests: NextPageWithLayout = () => {
  return <GuestsPage />;
};

Guests.Layout = MainLayout;

export default Guests;
