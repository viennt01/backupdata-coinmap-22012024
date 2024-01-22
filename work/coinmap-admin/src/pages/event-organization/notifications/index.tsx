import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import NotificationPage from '@/components/notification';

const Notification: NextPageWithLayout = () => {
  return <NotificationPage />;
};

Notification.Layout = MainLayout;

export default Notification;
