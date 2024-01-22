import AppHeader from '@/components/layout/components/app-header';
import AppFooter from '@/components/layout/components/app-footer';
import { Layout } from 'antd';

const { Content } = Layout;

interface Props {
  children: React.ReactNode;
}
export function PageWithNoLayout(props: Props) {
  return (
    <Layout className="app-layout">
      <AppHeader />
      <Layout>
        <Content>{props.children}</Content>
      </Layout>
      <AppFooter />
    </Layout>
  );
}
