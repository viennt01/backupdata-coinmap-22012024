import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import { Typography } from 'antd';

const { Title } = Typography;

const Home: NextPageWithLayout = () => {
  return <Title>Home</Title>;
};

Home.Layout = MainLayout;

export default Home;
