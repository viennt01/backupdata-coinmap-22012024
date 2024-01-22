import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import EventsPage from '@/components/events-page';

const Events: NextPageWithLayout = () => {
  return <EventsPage />;
};

Events.Layout = MainLayout;

export default Events;
