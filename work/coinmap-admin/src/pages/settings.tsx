import { NextPageWithLayout } from '@/pages/_app';
import MainLayout from '@/components/layout';
import { Typography } from 'antd';

const { Title } = Typography;

const Settings: NextPageWithLayout = () => {
  return <Title>Settings</Title>;
};

Settings.Layout = MainLayout;

export default Settings;
