import ROUTERS from '@/constants/router';
import {
  Layout,
  Image,
  Menu,
  Dropdown,
  Drawer,
  Row,
  Col,
  Radio,
  ConfigProvider,
  Button,
  Space,
} from 'antd';
import type { MenuProps } from 'antd';
import { NextRouter, useRouter } from 'next/router';
import { useContext, useEffect, useMemo, useState } from 'react';
import style from './index.module.scss';
import {
  SvgUserAvatar,
  SvgUserProfile,
  SvgLayers,
  SvgCreditCard,
  SvgLogout,
  SvgMenu,
} from '@/assets/images/svg';
import { appLocalStorage } from '@/utils/localstorage';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { AppContext } from '@/app-context';
import CustomButton from '@/components/common/custom-button';
import { headers } from '@/fetcher/utils';
import useI18n from '@/i18n/useI18N';
import COLORS from '@/constants/color';
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

  const [activePath, setActivePath] = useState('/');
  const { userInfo, setUserInfo } = useContext(AppContext);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [languageSelected, setLanguage] = useState(Language.VI);

  const isUserLogged = !!userInfo?.email;
  const { merchantInfo } = useContext(AppContext);

  const handleLogout = () => {
    if (setUserInfo) setUserInfo({});
    appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
    headers.setToken(null);
    router.push(ROUTERS.LOGIN);
  };

  const handleClickMenu: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case '#': {
        break;
      }
      default: {
        router.push(e.key);
        setShowMobileMenu(false);
      }
    }
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

  useEffect(() => {
    const languege = appLocalStorage.get(LOCAL_STORAGE_KEYS.LANGUAGE);
    if (languege && languege !== languageSelected) {
      const { pathname, asPath, query } = router;
      setLanguage(languege as Language);
      router.replace({ pathname, query }, asPath, { locale: languege });
    }
  }, []);

  useEffect(() => {
    const pathname = router.pathname;
    setActivePath(pathname);
  }, [router]);

  const userMenuItems = useMemo(
    () => [
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
    ],
    [translate, translateHeader]
  );

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

  const menuItemAuthorized = [
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
      <div className={style.user}>
        {!isUserLogged ? (
          <>
            <CustomButton
              className={style.loginButton}
              append={''}
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
            )}
          </>
        ) : (
          <>
            <CustomButton
              className={style.dashboardButton}
              append={''}
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
          <div
            className={style.mobileMenuTitle}
            onClick={!isUserLogged ? handleClickLogin : handleClickProfile}
          >
            <SvgUserAvatar />
            {isUserLogged ? userInfo.email : translate('login')}
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
              selectedKeys={[activePath]}
              items={
                isUserLogged
                  ? [...menuItemAuthorized, ...menuItemsTaskbar]
                  : [...menuItemsTaskbar]
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
                <CustomButton
                  className={style.loginButton}
                  append={''}
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
                )}
              </>
            )}
          </Col>
        </Row>
      </Drawer>
    </Header>
  );
};

export default AppHeader;
