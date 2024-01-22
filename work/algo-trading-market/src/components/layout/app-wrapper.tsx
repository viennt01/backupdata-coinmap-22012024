import { ERROR_CODE } from '@/constants/error-code';
import { AppContext } from '@/app-context';
import { useRouter } from 'next/router';
import { useContext, useEffect, useRef, useState } from 'react';
import { getMerchantInfo, getUserProfile } from './fetcher';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { headers } from '@/fetcher/utils';
import { appLocalStorage } from '@/utils/localstorage';
import { Kanit } from '@next/font/google';
import ROUTERS, { PAGE_NO_NEED_AUTHORIZE } from '@/constants/router';
import Analytics from './components/analytics';

const kanit = Kanit({
  weight: ['400', '500', '600', '700', '800'],
  variable: '--kanit-font',
  subsets: ['latin'],
});

interface Props {
  children: React.ReactNode;
}
export default function AppWrapper({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [loadingMerchant, setLoadingMerchant] = useState(true);
  const { setMerchantInfo, setUserInfo } = useContext(AppContext);
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
  }, [setMerchantInfo]);

  // check token
  useEffect(() => {
    if (setUserInfo && !loadingMerchant) checkToken();
  }, [setUserInfo, loadingMerchant]);

  if (loadingMerchant || loading) return null;

  return (
    <>
      {/* merchant analytics */}
      <Analytics
        startScript={startMerchantAnalytics}
        analytics={analyticsRef.current}
      />
      <div style={{ height: '100%', fontFamily: kanit.style.fontFamily }}>
        {children}
      </div>
    </>
  );
}
