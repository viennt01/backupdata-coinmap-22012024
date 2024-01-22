import React from 'react';
import { Layout } from 'antd';
import style from './index.module.scss';
import AppHeader from '@/components/layout/components/app-header';
import AppSider from '@/components/layout/components/app-sider';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
}

const LayoutDashboard = ({ children }: Props) => {
  return (
    <Layout className="app-layout">
      <AppHeader />
      <Layout>
        <AppSider />
        <Layout>
          <Content className={style.contentContainer}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutDashboard;
