import Image from 'next/image';
import { Layout, Typography, Avatar, Button, Menu } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  DollarOutlined,
  OrderedListOutlined,
  QuestionCircleOutlined,
  RedditOutlined,
  AccountBookOutlined,
  ClusterOutlined,
  CalendarOutlined,
  BellOutlined,
  AuditOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { ERROR_CODE, LOCAL_CACHE_KEYS } from '@/constants/code-constants';
import { headers } from '@/fetcher/utils';
import { validateToken, AdminListEventOutput } from '@/utils/api-getters';
import { errorToast } from '@/hook/toast';
import { ROUTERS } from '@/constants/router';

interface LayoutProps {
  children?: React.ReactNode;
}

type MenuItem = Required<MenuProps>['items'][number];

const { Title, Text } = Typography;
const { Content, Sider } = Layout;

// TODO: get user info
const userInfo = {
  imageUrl: '/images/user-logo.jpg',
  name: 'Admin 007',
  role: 'Admin',
};

const MainLayout: React.FC<LayoutProps> = (props) => {
  const router = useRouter();
  const [path, setPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [broken, setBroken] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const checkToken = () => {
    const token = localStorage.getItem(LOCAL_CACHE_KEYS.CM_TOKEN);
    headers.setToken(token);

    validateToken()
      .then((res: AdminListEventOutput) => {
        if (res.error_code !== ERROR_CODE.SUCCESS) {
          errorToast('Token invalid');
          localStorage.removeItem(LOCAL_CACHE_KEYS.CM_TOKEN);
          router.push('/login');
        }
      })
      .catch(() => {
        errorToast('Token invalid');
        localStorage.removeItem(LOCAL_CACHE_KEYS.CM_TOKEN);
        router.push('/login');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === '/logout') return handleLogout();
    router.push(e.key);
  };

  useEffect(() => {
    if (router.pathname === ROUTERS.HOME) {
      setPath(ROUTERS.AFFILIATE_MERCHANT);
      router.push(ROUTERS.AFFILIATE_MERCHANT);
    } else {
      const selectedMenu = Object.values(ROUTERS).find(
        (URL) => router.pathname === URL
      );
      setPath(selectedMenu ?? '');
    }
  }, [router]);

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  const items: MenuProps['items'] = [
    getItem('Event Organization', ROUTERS.EVENT_ORGANIZATION, null, [
      getItem('Events', ROUTERS.EVENTS, <CalendarOutlined />),
      getItem('Guests', ROUTERS.GUESTS, <UserOutlined />),
      getItem('Notifications', ROUTERS.NOTIFICATIONS, <BellOutlined />),
    ]),
    getItem('Affiliate', ROUTERS.AFFILIATE, null, [
      getItem('Merchant', ROUTERS.AFFILIATE_MERCHANT, <AppstoreOutlined />),
      getItem('User', ROUTERS.AFFILIATE_USER, <UserOutlined />),
      getItem('Payment', ROUTERS.AFFILIATE_PAYMENT, <DollarOutlined />),
      getItem('FAQ', ROUTERS.AFFILIATE_FAQ, <QuestionCircleOutlined />),
      getItem(
        'Package Period',
        ROUTERS.AFFILIATE_PACKAGE_PERIOD,
        <RedditOutlined />
      ),
      getItem(
        'TBot Period',
        ROUTERS.AFFILIATE_TBOT_PERIOD,
        <OrderedListOutlined />
      ),
      getItem('TBot Fee', ROUTERS.AFFILIATE_TBOT_FEE, <AccountBookOutlined />),
      getItem('Broker', ROUTERS.AFFILIATE_BROKER, <ClusterOutlined />),
    ]),
    getItem('Content Manager', ROUTERS.CONTENT_MANAGER, null, [
      getItem('Home Page', ROUTERS.HOME_PAGE, <HomeOutlined />),
      getItem('Policy', ROUTERS.POLICY, <AuditOutlined />),
    ]),
    { type: 'divider' },
    {
      label: 'Logout',
      key: ROUTERS.LOGOUT,
      icon: <LogoutOutlined />,
      danger: true,
      style: { color: 'red', marginBottom: 0, marginTop: 'auto' },
    } as MenuItem,
  ];

  const handleLogout = () => {
    localStorage.removeItem(LOCAL_CACHE_KEYS.CM_TOKEN);
    router.push('/login');
  };

  if (loading) return null;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={320}
        breakpoint="lg"
        collapsedWidth={60}
        theme="light"
        onBreakpoint={(broken) => setBroken(broken)}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <div>
            <div
              style={{
                display: !collapsed ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '24px 0',
                gap: '8px',
                cursor: 'pointer',
              }}
              onClick={() => router.push(ROUTERS.AFFILIATE_MERCHANT)}
            >
              <Image
                src="/images/coinmap-logo.svg"
                alt="logo"
                width={48}
                height={48}
              />
              <div hidden={broken}>
                <Title level={4} style={{ fontWeight: 'bold', margin: 0 }}>
                  COINMAP ADMIN
                </Title>
              </div>
            </div>
            <div
              style={{
                display: !collapsed ? 'block' : 'none',
                textAlign: 'center',
              }}
              hidden={broken}
            >
              {userInfo.imageUrl ? (
                <Avatar size={128} src={userInfo.imageUrl} />
              ) : (
                <Avatar size={128} icon={<UserOutlined />} />
              )}
              <Title level={4} style={{ fontWeight: 'bold', margin: '16px 0' }}>
                {userInfo.name}
              </Title>
              <Button type="primary">{userInfo.role}</Button>
            </div>
            <Menu
              items={items}
              mode="inline"
              style={{ marginTop: '16px' }}
              selectedKeys={[path]}
              onClick={onClick}
              defaultOpenKeys={[ROUTERS.AFFILIATE]}
            />
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <Text disabled>{process.env.VERSION}</Text>
          </div>
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: 24, minHeight: 600 }}>
          {props.children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
