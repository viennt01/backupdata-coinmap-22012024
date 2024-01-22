import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import EventsCreatePage from '@/components/events-create-page';

const EventsCreate: NextPageWithLayout = () => {
  return <EventsCreatePage />;
};

EventsCreate.Layout = MainLayout;

export default EventsCreate;
