import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import HomePage from '@/components/affiliate/merchants/merchant-edit-page/home-page';

const Home: NextPageWithLayout = () => {
  return <HomePage />;
};

Home.Layout = MainLayout;

export default Home;
