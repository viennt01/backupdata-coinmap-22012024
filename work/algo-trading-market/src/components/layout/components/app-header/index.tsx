import ROUTERS from '@/constants/router';
import { Layout, Image, Menu, Drawer, Row, Col, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import style from './index.module.scss';
import {
  SvgCreditCard,
  SvgLayers,
  SvgLogout,
  SvgMenu,
  SvgUserAvatar,
  SvgUserProfile,
} from '@/assets/images/svg';
import { appLocalStorage } from '@/utils/localstorage';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { AppContext } from '@/app-context';
import CustomButton from '@/components/common/custom-button';
import SvgClose from './assets/close.svg';
import { headers } from '@/fetcher/utils';

const { Header } = Layout;

const menuItems = [
  {
    key: ROUTERS.HOME,
    label: 'Home',
  },
  {
    key: ROUTERS.FEATURES,
    label: 'Features',
  },
  {
    key: ROUTERS.MARKET,
    label: 'Market',
  },
  {
    key: ROUTERS.PRICING,
    label: 'Pricing',
  },
  {
    key: ROUTERS.CONTACT,
    label: 'Contact',
  },
];

const userMenuItems = [
  {
    key: ROUTERS.PROFILE,
    label: (
      <div className={style.userMenuItem}>
        My profile
        <SvgUserProfile />
      </div>
    ),
  },
  {
    key: ROUTERS.MY_PLAN,
    label: (
      <div className={style.userMenuItem}>
        My plans
        <SvgLayers />
      </div>
    ),
  },
  {
    key: ROUTERS.MY_PAYMENT,
    label: (
      <div className={style.userMenuItem}>
        My payments
        <SvgCreditCard />
      </div>
    ),
  },
  {
    key: ROUTERS.LOGOUT,
    label: (
      <div className={style.userMenuItem}>
        Log out
        <SvgLogout />
      </div>
    ),
  },
];

const AppHeader = () => {
  const router = useRouter();
  const { userInfo, setUserInfo, merchantInfo } = useContext(AppContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isUserLogged = !!userInfo?.email;

  const handleLogout = () => {
    if (setUserInfo) setUserInfo({});
    appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
    headers.setToken(null);
    router.push(ROUTERS.LOGIN);
  };

  const handleClickMenu: MenuProps['onClick'] = (e) => {
    setShowMobileMenu(false);
    router.push(e.key);
  };

  const handleClickUserMenu: MenuProps['onClick'] = (e) => {
    if (e.key === ROUTERS.LOGOUT) {
      handleLogout();
    } else {
      router.push(e.key);
    }
  };

  const handleClickLogin = () => {
    setShowMobileMenu(false);
    router.push(ROUTERS.LOGIN);
  };

  const handleClickRegister = () => {
    setShowMobileMenu(false);
    router.push(ROUTERS.REGISTER);
  };

  const handleClickProfile = () => {
    setShowMobileMenu(false);
    router.push(ROUTERS.PROFILE);
  };

  return (
    <Header className={style.appHeader}>
      <Image
        className={style.logo}
        src={merchantInfo?.config?.logo_url ?? '/svg/logo.svg'}
        alt="logo"
        preview={false}
        onClick={() => router.push(ROUTERS.HOME)}
      />
      <Menu
        className={style.menu}
        mode="horizontal"
        selectedKeys={['']}
        items={menuItems}
        onClick={handleClickMenu}
      />
      <div className={style.user}>
        {!isUserLogged ? (
          <>
            <Button
              type="primary"
              className={style.loginButton}
              size="large"
              onClick={handleClickLogin}
            >
              SIGN IN
            </Button>
            <Button
              type="text"
              className={style.registerButton}
              size="large"
              onClick={handleClickRegister}
            >
              SIGN UP
            </Button>
          </>
        ) : (
          <>
            <Button
              type="primary"
              className={style.dashboardButton}
              size="large"
              onClick={() => router.push(ROUTERS.DASHBOARD)}
            >
              BOT DASHBOARD
            </Button>
            <Dropdown
              overlayClassName={style.userMenu}
              placement="bottomRight"
              menu={{ items: userMenuItems, onClick: handleClickUserMenu }}
              trigger={['click']}
            >
              <div className={style.user}>
                <span className={style.userEmail}>
                  {userInfo?.email} {userInfo?.email}
                </span>
                <SvgUserAvatar />
              </div>
            </Dropdown>
          </>
        )}
      </div>
      <SvgMenu
        className={style.menuButton}
        onClick={() => setShowMobileMenu(true)}
      />
      <Drawer
        className={style.mobileMenuWrapper}
        title={
          <div className={style.mobileMenuTitle}>
            <div
              className={style.title}
              onClick={!isUserLogged ? handleClickLogin : handleClickProfile}
            >
              <SvgUserAvatar />
              <span className={style.userEmail}>
                {isUserLogged ? userInfo.email : 'SIGN IN'}
              </span>
            </div>
            <Button
              type="text"
              className={style.closeDrawer}
              onClick={() => setShowMobileMenu(false)}
            >
              <SvgClose />
            </Button>
          </div>
        }
        closeIcon={null}
        placement="right"
        zIndex={99999}
        onClose={() => setShowMobileMenu(false)}
        open={showMobileMenu}
      >
        <Row
          style={{
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Col flex={1}>
            <Menu
              className={style.mobileMenu}
              mode="vertical"
              selectedKeys={['']}
              items={
                isUserLogged
                  ? [
                      ...menuItems,
                      {
                        key: ROUTERS.DASHBOARD,
                        label: 'Bot dashboard',
                      },
                    ]
                  : menuItems
              }
              onClick={handleClickMenu}
            />
          </Col>
          <Col>
            {isUserLogged ? (
              <CustomButton
                className={style.logoutButton}
                onClick={handleLogout}
              >
                SIGN OUT
              </CustomButton>
            ) : (
              <>
                <Button
                  block
                  type="primary"
                  className={style.loginButton}
                  size="large"
                  onClick={handleClickLogin}
                >
                  SIGN IN
                </Button>
                <Button
                  block
                  type="text"
                  className={style.registerButton}
                  size="large"
                  onClick={handleClickRegister}
                >
                  SIGN UP
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Drawer>
    </Header>
  );
};

export default AppHeader;
