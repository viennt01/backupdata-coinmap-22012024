import style from './index.module.scss';
import React, { useContext, useEffect, useState } from 'react';
import { ConfigProvider, MenuProps } from 'antd';
import { Layout, Menu, Typography } from 'antd';
import { ItemType } from 'antd/es/menu/hooks/useItems';
import { useRouter } from 'next/router';
import ROUTERS from '@/constants/router';
import { SvgDashboard, SvgTradingBot, SvgMenu } from '@/assets/images/svg';
import { AppContext } from '@/app-context';

const { Sider } = Layout;
const { Title } = Typography;

const items: MenuProps['items'] = [
  {
    key: ROUTERS.DASHBOARD,
    icon: <SvgDashboard />,
    label: `Dashboard`,
  },
  {
    key: ROUTERS.TRADING_BOT,
    icon: <SvgTradingBot />,
    label: `A.I Trading`,
  },
];

const AppSider = () => {
  const [collapsibleSidebar, setCollapsibleSidebar] = useState(false);
  const [tabActivated, setTabActivated] = useState<ROUTERS>(ROUTERS.DASHBOARD);
  const { appTheme } = useContext(AppContext);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      setTabActivated(router.route as ROUTERS);
    }
  }, [router]);

  const handleClickTabItem = (e: ItemType) => {
    if (e?.key) {
      setTabActivated(e.key as ROUTERS);
      router.push(e.key as string);
    }
  };

  return (
    <Sider
      width={304}
      collapsedWidth={72}
      className={style.sidebarContainer}
      style={{ background: appTheme.colors.secondary_darken_1 }}
      collapsed={collapsibleSidebar}
      onCollapse={() => setCollapsibleSidebar((prev) => !prev)}
      breakpoint="lg"
    >
      <Title className={style.title}>
        {!collapsibleSidebar && 'A.I Trading'}
        <SvgMenu onClick={() => setCollapsibleSidebar((prev) => !prev)} />
      </Title>
      <ConfigProvider
        theme={{
          token: {
            colorPrimaryBg: 'transparent',
          },
        }}
      >
        <Menu
          onClick={handleClickTabItem}
          activeKey={tabActivated}
          selectedKeys={[tabActivated]}
          className={style.sidebarMenu}
          items={items}
        />
      </ConfigProvider>
    </Sider>
  );
};

export default AppSider;
