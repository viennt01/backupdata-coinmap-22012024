import { ERROR_CODE } from '@/constants/error-code';
import { AppContext } from '@/app-context';
import { useRouter } from 'next/router';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { getMerchantInfo, getUserProfile } from './fetcher';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { headers } from '@/fetcher/utils';
import { appLocalStorage } from '@/utils/localstorage';
import ROUTERS, { PAGE_NO_NEED_AUTHORIZE } from '@/constants/router';
import Analytics from './components/analytics';
import ProgressModal from '@/components/common/progress-modal';
import { ConfigProvider } from 'antd';
import { appFont, getThemeApp, setColorToRoot } from '@/utils/theme';
import Head from 'next/head';

interface Props {
  children: React.ReactNode;
}

const canUseDOM = typeof window !== 'undefined';
const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

export default function AppWrapper({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  const {
    appTheme,
    merchantInfo,
    setMerchantInfo,
    setUserInfo,
    setAppTheme,
    openProgressModal,
  } = useContext(AppContext);
  const router = useRouter();
  const [startMerchantAnalytics, setStartMerchantAnalytics] = useState(false);
  const analyticsRef = useRef<{ ggTagIds: string[]; fbPixelId: string }>({
    ggTagIds: [],
    fbPixelId: '',
  });

  const pageNoNeedAuthorize = PAGE_NO_NEED_AUTHORIZE.some(
    (pathname) => pathname === router.pathname
  );

  const handlePageNoAuthentication = () => {
    if (setUserInfo) setUserInfo({});
    appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
    headers.setToken(null);
    router.replace(ROUTERS.LOGIN);
  };

  const fetchUserInfo = async () => {
    await getUserProfile()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          if (setUserInfo) {
            setUserInfo(res.payload);
          }
        } else {
          handlePageNoAuthentication();
        }
      })
      .catch((err) => {
        console.log('Error check token', err);
      });
  };

  const checkToken = async () => {
    try {
      // pages no authorize => token ? fetch profile : do nothing
      // pages authorize => token ? fetch profile === success ? update data : handlePageNoAuthentication
      const token = appLocalStorage.get(LOCAL_STORAGE_KEYS.TOKEN);

      if (pageNoNeedAuthorize) {
        setLoading(false);
        if (token) {
          headers.setToken(token);
          fetchUserInfo();
        }
        return;
      }

      if (!token) {
        handlePageNoAuthentication();
        setLoading(false);
        return;
      } else {
        headers.setToken(token);
        await fetchUserInfo();
        setLoading(false);
      }
    } catch (err) {
      console.log('Error check token', err);
    }
  };

  // get merchant info
  useEffect(() => {
    getMerchantInfo()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          if (res.payload.code === 'CM') return;
          headers.setAffiliateCode(res.payload.code);

          // store merchant info
          if (setMerchantInfo) {
            setMerchantInfo(res.payload);
          }

          // store theme info and set to root
          const localTheme = appLocalStorage.get(LOCAL_STORAGE_KEYS.THEME);
          const appTheme = res.payload.config.theme;
          const appThemeStringify = JSON.stringify(appTheme);
          if (setAppTheme && appTheme && appThemeStringify !== localTheme) {
            setColorToRoot(appTheme.colors);
            appLocalStorage.set(LOCAL_STORAGE_KEYS.THEME, appThemeStringify);
            setAppTheme(appTheme);
          }

          // store data for google and facebook analytics
          const { tracking_id, google_tag_manager_id, fbPixelId } =
            res.payload.config;
          if (tracking_id) {
            analyticsRef.current.ggTagIds = [tracking_id];
          }
          if (google_tag_manager_id) {
            analyticsRef.current.ggTagIds.push(google_tag_manager_id);
          }
          if (fbPixelId) {
            analyticsRef.current.fbPixelId = fbPixelId;
          }
          setStartMerchantAnalytics(true);
        }
      })
      .catch((err) => {
        console.log('Error check token', err);
      })
      .finally(() => setLoadingMerchant(false));
  }, [setMerchantInfo, setAppTheme]);

  // check token
  useEffect(() => {
    if (setUserInfo && !loadingMerchant) checkToken();
  }, [setUserInfo, loadingMerchant]);

  // get theme from local storage
  useIsomorphicLayoutEffect(() => {
    const localTheme = appLocalStorage.get(LOCAL_STORAGE_KEYS.THEME);
    if (localTheme && setAppTheme) {
      const appTheme = JSON.parse(localTheme);
      setColorToRoot(appTheme.colors);
      setAppTheme(appTheme);
    }
  }, [setAppTheme]);

  if (loadingMerchant || loading) return null;

  return (
    <ConfigProvider theme={getThemeApp(appTheme)}>
      {/* favicon */}
      <Head>
        <link
          rel="favicon"
          href={merchantInfo?.config.favicon_url ?? '/svg/bot.svg'}
        />
        <link
          rel="shortcut icon"
          href={merchantInfo?.config.favicon_url ?? '/svg/bot.svg'}
        />
      </Head>

      {/* merchant analytics */}
      <Analytics
        startScript={startMerchantAnalytics}
        analytics={analyticsRef.current}
      />
      <div style={{ height: '100%', fontFamily: appFont.style.fontFamily }}>
        {children}
      </div>
      <ProgressModal open={openProgressModal} />
    </ConfigProvider>
  );
}
