import React from 'react';
import { Layout } from 'antd';
import style from './index.module.scss';
import AppHeader from '@/components/layout/components/app-header';
import AppFooter from '@/components/layout/components/app-footer';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
}

const LayoutDefault = ({ children }: Props) => {
  return (
    <Layout className="app-layout">
      <AppHeader />
      <Layout>
        <Layout>
          <Content className={style.contentContainer}>{children}</Content>
        </Layout>
      </Layout>
      <AppFooter />
    </Layout>
  );
};

export default LayoutDefault;
