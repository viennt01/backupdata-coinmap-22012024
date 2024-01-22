import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import EventsEditPage from '@/components/events-edit-page';

const EventsEdit: NextPageWithLayout = () => {
  return <EventsEditPage />;
};

EventsEdit.Layout = MainLayout;

export default EventsEdit;
