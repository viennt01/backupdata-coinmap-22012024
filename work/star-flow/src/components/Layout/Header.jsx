import { useRef, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import Icons from '@/components/HomePage/components/Icons';
import SideBar from './Sidebar/Sidebar';
import { useRouter } from 'next/router';
import style from './Header.module.scss';
import {
  IconExit,
  IconMoney,
  IconProfile,
  IconUserGuide,
} from '@/assets/images/svg/svgToJsx';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import { SvgDashboardMenu } from '@/assets/images/svg/iconV2';
import { useSelector } from 'react-redux';
import { limitDevice } from '@/utils/limitDevice';
import { Layout, Button, ConfigProvider, Menu, Drawer } from 'antd';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { PATHNAME_TO_ID } from '@/utils/pagePermission/ability';
import { FEATURE_ID } from '@/config/consts/pagePermission';
import { ScheduleOutlined } from '@ant-design/icons';

const { Header: AntdHeader } = Layout;

const userGuideLink = process.env.USER_GUIDE_LINK;

export const menuItems = [
  {
    key: `/`,
    label: `Home`,
  },
  {
    key: `/about`,
    label: `About`,
  },
  {
    key: `/ecosystems`,
    label: `Ecosystems`,
  },
  {
    key: `/pricing`,
    label: `Pricing & Packages`,
  },
  // {
  //   key: `/marketplace`,
  //   label: `Marketplace`,
  // },
  {
    key: `/contact`,
    label: `Contact`,
  },
];

const Header = () => {
  const { id, first_name, last_name, profile_pic } = useSelector(
    (state) => state.userProfile.user
  );
  const router = useRouter();
  const [sidebar, setSidebar] = useState(false);
  const [displayStatus, setDisplayStatus] = useState(false);
  const [displayDropdownDashboard, setDisplayDropdownDashboard] =
    useState(false);
  const usernameRef = useRef(null);
  const dashboardRef = useRef(null);
  const [activePath, setActivePath] = useState('/');
  const pageAbility = useAbility(PageAbilityContext);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);

  const filteredMenuItems = useMemo(() => {
    return !merchantInfo.checkPermission
      ? menuItems
      : menuItems.filter((item) =>
          pageAbility.can(PERMISSION_ACTIONS.VIEW, PATHNAME_TO_ID[item.key])
        );
  }, [merchantInfo, pageAbility]);

  const canIChange = (featureId) =>
    merchantInfo.checkPermission &&
    pageAbility.can(PERMISSION_ACTIONS.UPDATE, featureId);

  const canIView = (featureId) =>
    !merchantInfo.checkPermission ||
    pageAbility.can(PERMISSION_ACTIONS.VIEW, featureId);

  useEffect(() => {
    const pathname = router.pathname;
    setActivePath(pathname);
  }, [router]);

  useEffect(() => {
    if (sidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'initial';
    }
  }, [sidebar]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (usernameRef.current && !usernameRef.current.contains(event.target)) {
        setDisplayStatus(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [usernameRef]);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target)
      ) {
        setDisplayDropdownDashboard(false);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dashboardRef]);

  const handleLogout = () => {
    limitDevice.clearLoginData();
    limitDevice.closeSocket();
    limitDevice.logoutOtherTabs();
    setDisplayStatus(false);
    router.push('/');
  };

  const changeTab = (page) => {
    router.push(page);
    setDisplayStatus(!displayStatus);
  };
  const handleClickUserGuide = () => {
    if (userGuideLink) {
      window.open(userGuideLink);
    }
  };

  const handleClickMenu = (e) => {
    router.push(e.key);
  };
  const handleClickCextrading = () => {
    router.push('/chart');
  };

  const handleClickSignalBot = () => {
    router.push('/signal-bot-dashboard');
  };

  const handleLaunchTradingBot = () => {
    if (merchantInfo.checkPermission) {
      window.open(`${merchantInfo.profile.domain}/trading-bot`);
    } else {
      window.open(`${window.location.origin}/trading-bot`);
    }
  };

  return (
    <AntdHeader className={style.antdHeader}>
      <header className={style.container}>
        <div className={style.box__1}>
          <Link href="/" passHref>
            <div className={style.group}>
              <img
                src={
                  canIChange(FEATURE_ID.HEADER_LOGO)
                    ? merchantInfo.profile.config.logo_url
                    : '/images/logo.png'
                }
                alt="logo-coinmap"
                width={54}
                height={54}
              />
            </div>
          </Link>
          <Menu
            className={style.menu}
            mode="horizontal"
            selectedKeys={[activePath]}
            items={filteredMenuItems}
            onClick={handleClickMenu}
          />
        </div>

        <div className={style.box__2}>
          <div
            onClick={() => router.push('/login')}
            className={style.groupItemLogin}
          >
            <Icons name={Icons.names.user} />
            <h1>Login</h1>
          </div>
        </div>

        <div className={style.box__3}>
          <button onClick={() => setSidebar(true)}>
            <Icons name={Icons.names.menu} />
          </button>
          <Drawer
            title=""
            closable={false}
            placement="right"
            onClose={() => setSidebar(false)}
            open={sidebar}
            width="90%"
          >
            <SideBar />
          </Drawer>
        </div>
      </header>
    </AntdHeader>
  );
};

export default Header;
