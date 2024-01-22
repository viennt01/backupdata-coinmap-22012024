import ROUTERS from '@/constants/router';
import {
  Layout,
  Image,
  Menu,
  Drawer,
  Row,
  Col,
  Button,
  Dropdown,
  ConfigProvider,
  Radio,
  Space,
} from 'antd';
import type { MenuProps } from 'antd';
import { NextRouter, useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
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
import COLORS from '@/constants/color';
import useI18n from '@/i18n/useI18N';
import { DownOutlined } from '@ant-design/icons';

const { Header } = Layout;

enum Language {
  VI = 'vi',
  EN = 'en',
}

const WIDTH_FLAG = 36;

const items: MenuProps['items'] = [
  {
    label: (
      <Space>
        <Image
          preview={false}
          width={WIDTH_FLAG}
          src={'/images/en.png'}
          alt="en"
        />
        <span>English</span>
      </Space>
    ),
    key: Language.EN,
  },
  {
    type: 'divider',
  },
  {
    label: (
      <Space>
        <Image
          preview={false}
          width={WIDTH_FLAG}
          src={'/images/vi.png'}
          alt="vi"
        />
        <span>Vietnamese</span>
      </Space>
    ),
    key: Language.VI,
  },
];

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
    key: ROUTERS.MARKETPLACE_PAGE,
    label: 'Market',
  },
  // {
  //   key: ROUTERS.PRICING,
  //   label: 'Pricing',
  // },
  {
    key: ROUTERS.CONTACT,
    label: 'Contact',
  },
];

interface SelectLanguage {
  languageSelected: Language;
  setLanguage: (language: Language) => void;
  router: NextRouter;
}

const SelectLanguage = ({
  languageSelected,
  setLanguage,
  router,
}: SelectLanguage) => {
  const onClick: MenuProps['onClick'] = ({ key }) => {
    setLanguage(key as Language);
    const { pathname, asPath, query } = router;
    router.replace({ pathname, query }, asPath, { locale: key });
    appLocalStorage.set(LOCAL_STORAGE_KEYS.LANGUAGE, key);
  };
  return (
    <div className={style.language}>
      <Dropdown
        overlayClassName={style.languageMenu}
        menu={{ items, onClick }}
        arrow={{ pointAtCenter: true }}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Space>
          <Image
            preview={false}
            width={WIDTH_FLAG}
            alt=""
            src={`/images/${languageSelected}.png`}
          />
          <DownOutlined />
        </Space>
      </Dropdown>
    </div>
  );
};

const AppHeader = () => {
  const router = useRouter();
  const { translate } = useI18n();
  const { translate: translateHeader } = useI18n('header');

  const { userInfo, setUserInfo, merchantInfo, appTheme } =
    useContext(AppContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [languageSelected, setLanguage] = useState(Language.VI);

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

  // const handleClickLogin = () => {
  //   setShowMobileMenu(false);
  //   router.push(ROUTERS.LOGIN);
  // };

  // const handleClickRegister = () => {
  //   setShowMobileMenu(false);
  //   router.push(ROUTERS.REGISTER);
  // };

  // const handleClickProfile = () => {
  //   setShowMobileMenu(false);
  //   router.push(ROUTERS.PROFILE);
  // };

  useEffect(() => {
    const languege = appLocalStorage.get(LOCAL_STORAGE_KEYS.LANGUAGE);
    if (languege && languege !== languageSelected) {
      const { pathname, asPath, query } = router;
      setLanguage(languege as Language);
      router.replace({ pathname, query }, asPath, { locale: languege });
    }
  }, []);

  const userMenuItems = [
    {
      key: ROUTERS.PROFILE,
      label: (
        <div className={style.userMenuItem}>
          {translateHeader('profile')}
          <SvgUserProfile />
        </div>
      ),
    },
    {
      key: ROUTERS.MY_PLAN,
      label: (
        <div className={style.userMenuItem}>
          {translateHeader('plan')}
          <SvgLayers />
        </div>
      ),
    },
    {
      key: ROUTERS.MY_PAYMENT,
      label: (
        <div className={style.userMenuItem}>
          {translateHeader('payment')}
          <SvgCreditCard />
        </div>
      ),
    },
    {
      key: ROUTERS.LOGOUT,
      label: (
        <div className={style.userMenuItem}>
          {translate('logout')}
          <SvgLogout />
        </div>
      ),
    },
  ];

  const menuItemsTaskbar = [
    {
      key: '#',
      label: (
        <div className={style.userMenuItem}>
          {translate('language')}
          <ConfigProvider>
            <Radio.Group
              buttonStyle="solid"
              value={languageSelected}
              onChange={(e) => {
                setLanguage(e.target.value as Language);
                const { pathname, asPath, query } = router;
                router.replace({ pathname, query }, asPath, {
                  locale: e.target.value,
                });
                appLocalStorage.set(
                  LOCAL_STORAGE_KEYS.LANGUAGE,
                  e.target.value
                );
              }}
            >
              <Radio.Button value={Language.VI}>
                <Image
                  preview={false}
                  width={36}
                  src={'/images/vi.png'}
                  alt="vi"
                />
              </Radio.Button>
              <Radio.Button value={Language.EN}>
                <Image
                  preview={false}
                  width={36}
                  src={'/images/en.png'}
                  alt="en"
                />
              </Radio.Button>
            </Radio.Group>
          </ConfigProvider>
        </div>
      ),
    },
  ];

  return (
    <Header className={style.appHeader}>
      <Image
        className={style.logo}
        src={merchantInfo?.config?.logo_url ?? ''}
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
            {/* <CustomButton
              className={style.loginButton}
              append={''}
              textColor={appTheme.colors.secondary}
              backgroundColor={appTheme.colors.on_secondary}
              onClick={handleClickLogin}
            >
              {translate('login')}
            </CustomButton>
            {merchantInfo?.config?.user_registration && (
              <Button
                type="text"
                className={style.registerButton}
                size="large"
                onClick={handleClickRegister}
              >
                {translate('signup')}
              </Button>
            )} */}
          </>
        ) : (
          <>
            <CustomButton
              className={style.dashboardButton}
              append={''}
              textColor={appTheme.colors.secondary}
              backgroundColor={appTheme.colors.on_secondary}
              onClick={() => router.push(ROUTERS.DASHBOARD)}
            >
              {translate('dashboard')}
            </CustomButton>
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
        <SelectLanguage
          languageSelected={languageSelected}
          setLanguage={setLanguage}
          router={router}
        />
      </div>
      <SvgMenu
        className={style.menuButton}
        onClick={() => setShowMobileMenu(true)}
      />
      <Drawer
        className={style.mobileMenuWrapper}
        title={
          <div className={style.mobileMenuTitle}>
            {/* <div
              className={style.title}
              onClick={!isUserLogged ? handleClickLogin : handleClickProfile}
            >
              <SvgUserAvatar />
              <span className={style.userEmail}>
                {isUserLogged ? userInfo.email : translate('login')}
              </span>
            </div> */}
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
            minHeight: '100%',
          }}
          gutter={[16, 16]}
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
                        label: 'Dashboard',
                      },
                      ...menuItemsTaskbar,
                    ]
                  : [...menuItems, ...menuItemsTaskbar]
              }
              onClick={handleClickMenu}
            />
          </Col>
          <Col>
            {isUserLogged ? (
              <CustomButton
                className={style.logoutButton}
                backgroundColor={COLORS.SUNSET_ORANGE}
                textColor={COLORS.WHITE}
                onClick={handleLogout}
              >
                {translate('logout')}
              </CustomButton>
            ) : (
              <>
                {/* <CustomButton
                  className={style.loginButton}
                  append={''}
                  textColor={appTheme.colors.secondary}
                  backgroundColor={appTheme.colors.on_secondary}
                  onClick={handleClickLogin}
                >
                  {translate('login')}
                </CustomButton>
                {merchantInfo?.config?.user_registration && (
                  <Button
                    block
                    type="text"
                    className={style.registerButton}
                    size="large"
                    onClick={handleClickRegister}
                  >
                    {translate('signup')}
                  </Button>
                )} */}
              </>
            )}
          </Col>
        </Row>
      </Drawer>
    </Header>
  );
};

export default AppHeader;
