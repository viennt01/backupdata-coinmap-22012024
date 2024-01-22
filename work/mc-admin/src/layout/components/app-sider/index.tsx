import style from './index.module.scss';
import React, { useEffect, useState } from 'react';
import {
  LogoutOutlined,
  LineChartOutlined,
  SettingOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  MenuOutlined,
  AppstoreOutlined,
  DollarCircleOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, MenuProps } from 'antd';
import { Layout, Menu, Row, Col } from 'antd';
import { ROUTERS } from '@/constant/router';
import { useRouter } from 'next/router';
import { MenuInfo } from 'rc-menu/lib/interface';
import { Modal, Typography } from 'antd';
import { appLocalStorage } from '@/utils/localstorage';
import { LOCAL_STORAGE_KEYS } from '@/constant/localstorage';

const { Text, Title } = Typography;
const { Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  disabled?: boolean,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    disabled,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Dashboard', ROUTERS.HOME, <LineChartOutlined />),
  getItem('Settings', ROUTERS.SETTINGS, <SettingOutlined />),
  getItem('A.I Trading', ROUTERS.AI_TRADING, <AppstoreOutlined />),
  getItem('Customer', ROUTERS.CUSTOMER_LIST, <TeamOutlined />),
  getItem('Orders', ROUTERS.TRANSACTION_LIST, <ShoppingCartOutlined />),
  getItem('Payment', ROUTERS.PAYMENT, <DollarCircleOutlined />),
  getItem('FAQ', ROUTERS.FAQ, <QuestionCircleOutlined />),
];

const AppSider = () => {
  const router = useRouter();
  const [modal, contextHolder] = Modal.useModal();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(ROUTERS.HOME);

  const handleClickMenuItem = (path: MenuInfo) => {
    setSelectedKey(path.key);
    router.push(path.key);
  };

  const handleClickLogout = () => {
    modal.confirm({
      centered: true,
      icon: <LogoutOutlined />,
      content: <Text>Do you want to sign out?</Text>,
      onOk() {
        appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
        router.push(ROUTERS.LOGIN);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    setSelectedKey(router.pathname ?? ROUTERS.HOME);
  }, [router]);

  return (
    <>
      {contextHolder}
      <Sider
        className={style.sidebarContainer}
        width={280}
        collapsedWidth={60}
        collapsed={collapsed}
        theme="light"
        breakpoint="xl"
        onCollapse={(value) => setCollapsed(value)}
      >
        <Row
          style={{
            flexDirection: 'column',
            height: '100%',
            flexWrap: 'nowrap',
          }}
        >
          <Col flex={1}>
            <Title className={style.title}>
              {!collapsed && 'MERCHANT ADMIN'}
              <MenuOutlined onClick={() => setCollapsed((prev) => !prev)} />
            </Title>
            <Menu
              selectedKeys={[selectedKey]}
              onClick={handleClickMenuItem}
              mode="inline"
              items={items}
            />
          </Col>
          <Col style={{ textAlign: 'center' }}>
            <Button
              style={{ margin: '24px 0' }}
              type="primary"
              size="large"
              danger
              icon={<LogoutOutlined />}
              onClick={handleClickLogout}
            >
              {collapsed ? '' : 'Sign out'}
            </Button>
          </Col>
        </Row>
      </Sider>
    </>
  );
};

export default AppSider;
