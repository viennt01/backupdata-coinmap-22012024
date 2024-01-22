import { useEffect, useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { ERROR_CODE, headers, headersUploadFromData } from '@/fetcher/utils';
import { GATEWAY, get } from '@/fetcher';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile } from '@/redux/actions/userProfile';
import { localStore } from '@/utils/localStorage';
import { LOCAL_CACHE_KEYS } from '@/config';
import { useRouter } from 'next/router';
import { limitDevice } from '@/utils/limitDevice';
import style from './index.module.scss';
import { ConfigProvider, theme } from 'antd';
import UserGuide from '../UserGuide';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';

// check pages use this layout
const PAGE_NO_NEED_AUTHORIZE = [
  '/',
  '/404',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/confirm-email',
  '/pricing',
  '/marketplace',
  '/about',
  '/ecosystems',
  '/contact',
  '/help',
];

export const Layout = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [openUserGuide, setOpenUserGuide] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const pageAbility = useAbility(PageAbilityContext);
  const [userInfo, merchantInfo] = useSelector((state) => [
    state.userProfile.user,
    state.common.merchantInfo,
  ]);

  const pageNoNeedAuthorize = PAGE_NO_NEED_AUTHORIZE.some(
    (pathname) => pathname === router.pathname
  );

  const canIView = (featureId) =>
    !merchantInfo.checkPermission ||
    pageAbility.can(PERMISSION_ACTIONS.VIEW, featureId);

  const handlePageNoAuthentication = () => {
    localStore.remove(LOCAL_CACHE_KEYS.CM_TOKEN);
    headersUploadFromData.setToken('');
    headers.setToken('');
    limitDevice.closeSocket();
    limitDevice.logoutOtherTabs();
    router.replace('/login');
  };

  const fetchUserProfile = () => {
    return get({
      headers,
      gw: GATEWAY.API_USER_ROLES_GW,
    })('/user/profile')
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          dispatch(setUserProfile(res.payload));
        } else {
          handlePageNoAuthentication();
        }
      })
      .catch((error) => {
        console.log('error check token', error);
      });
  };

  const checkToken = async () => {
    try {
      // pages no authorize => token ? fetch profile : do nothing
      // pages authorize => token ? fetch profile === sucess ? update data : handlePageNoAuthentication
      const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);

      if (pageNoNeedAuthorize) {
        setLoading(false);
        if (token) {
          headersUploadFromData.setToken(token);
          headers.setToken(token);
          fetchUserProfile();
        }
        return;
      }

      if (!token) {
        handlePageNoAuthentication();
        setLoading(false);
        return;
      } else {
        headersUploadFromData.setToken(token);
        headers.setToken(token);
        fetchUserProfile().finally(() => {
          setLoading(false);
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    checkToken();
  }, []);

  if (loading) return null;

  return (
    <>
      <div className={style.container}>
        <Header />
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
            token: {
              fontFamily: 'Montserrat',
              colorText: '#FFFFFF',
              colorTextPlaceholder: '#494762',
              colorTextDisabled: '#616887',
              colorBgContainer: '#1D1C32',
              colorBgContainerDisabled: '#151424',
              colorBorder: 'transparent',
              colorBgElevated: '#1D1C32',
              colorPrimaryHover: '#8F9BCE',
              colorPrimary: '#31AFFE',
            },
          }}
        >
          <div className={style.main}>{children}</div>
        </ConfigProvider>
        <Footer />
      </div>
      {canIView(FEATURE_ID.BUTTON_USER_GUIDE) && (
        <UserGuide
          openUserGuide={openUserGuide}
          setOpenUserGuide={setOpenUserGuide}
          userInfo={userInfo}
        />
      )}
    </>
  );
};
