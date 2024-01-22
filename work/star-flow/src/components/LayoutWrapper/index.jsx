import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useSelector, useDispatch } from 'react-redux';
import DeactivateModal from '@/components/DeactivateModal';
import { limitDevice } from '@/utils/limitDevice';
import { useRouter } from 'next/router';
import { updatePageAbility } from '@/utils/pagePermission/ability';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { PATHNAME_TO_ID } from '@/utils/pagePermission/ability';
import { decodeQueryString, generateAffiliateQuery } from '@/utils/common';
import { actSetMerchantInfo } from '@/redux/actions/common';
import { getMerchantInfo } from './fetcher';
import { DOMAIN_TYPES } from '@/constant/codeConstants';
import Analytics from '@/components/Analytics';
import { headers } from '@/fetcher/utils';
import GoogleAnalytics from '@/components/Analytics/GoogleAnalytics';
import { localStore } from '@/utils/localStorage';
import { LOCAL_CACHE_KEYS } from '@/config';

const canUseDOM = typeof window !== 'undefined';
const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

const LayoutWrapper = (props) => {
  const deactivate = useSelector((state) => state.common.deactivate);
  const dispatch = useDispatch();
  const router = useRouter();
  const pageAbility = useAbility(PageAbilityContext);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);
  const [loading, setLoading] = useState(true);
  const [startMerchantAnalytics, setStartMerchantAnalytics] = useState(false);
  const analyticsRef = useRef({
    ggTagIds: [],
    fbPixelId: '',
  });

  // push affiliate code to query when router change
  useIsomorphicLayoutEffect(() => {
    if (!merchantInfo.profile.code || !merchantInfo.domainType) return;
    const affiliateQuery = generateAffiliateQuery(
      merchantInfo.profile.code,
      merchantInfo.domainType
    );
    const noNeedToPushAffiliateQuery = Object.keys(router.query).includes(
      Object.keys(affiliateQuery)[0]
    );
    if (noNeedToPushAffiliateQuery) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          ...affiliateQuery,
        },
      },
      undefined,
      { shallow: true }
    );
  });

  // check limit device
  useEffect(() => {
    limitDevice.initialSocket({ router, dispatch });
    window.addEventListener(
      'storage',
      limitDevice.handleLoginIdChange.bind(limitDevice)
    );
    return () => {
      window.removeEventListener('storage', limitDevice.handleLoginIdChange);
    };
  }, []);

  // get merchant info based on domain or affiliate code
  const fetchMerchantInfo = async () => {
    try {
      const { f: feature, code, domain_type } = decodeQueryString(router.query);
      if (feature !== 'affiliate' && !code) return;

      // attach merchant code to header
      headers.setMerchantCode(code);

      // get merchant info
      const res = await getMerchantInfo();
      if (!res.payload?.code || res.payload.code === 'CM') return;

      if (domain_type === DOMAIN_TYPES.OTHERS) {
        // create page abilities based on merchant permission
        updatePageAbility(res.payload?.config?.permission);

        // store merchant info in redux
        dispatch(
          actSetMerchantInfo({
            checkPermission: true,
            domainType: domain_type,
            profile: res.payload,
          })
        );

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
      } else {
        headers.setMerchantCode('');
      }

      // store merchant info in redux
      dispatch(
        actSetMerchantInfo({
          checkPermission: domain_type === DOMAIN_TYPES.OTHERS,
          domainType: domain_type || DOMAIN_TYPES.COINMAP,
          profile: res.payload,
        })
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  // update page ability
  useEffect(() => {
    if (router.pathname === '/404') {
      setLoading(false);
    } else if (router.isReady) {
      fetchMerchantInfo();
    }
  }, [router]);

  // check path name based on page ability
  useEffect(() => {
    if (!merchantInfo.checkPermission) return;

    // no permission to view any pages
    if (!merchantInfo.profile.config.permission.pages.length) {
      router.replace('/404');
    } else if (
      pageAbility.cannot(
        PERMISSION_ACTIONS.VIEW,
        PATHNAME_TO_ID[router.pathname]
      )
    ) {
      router.replace(merchantInfo.profile.config.home_path ?? '/');
    }
  }, [router.pathname, merchantInfo, pageAbility]);

  useEffect(() => {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (!startMerchantAnalytics && token) {
      getMerchantInfo()
        .then((res) => {
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
        })
        .catch((e) => console.log(e));
    }
  });

  if (loading) return <></>;

  if (deactivate)
    return (
      <ErrorBoundary>
        <div>
          <DeactivateModal />
        </div>
      </ErrorBoundary>
    );

  return (
    <>
      {/* coinmap analytics */}
      <GoogleAnalytics ggTagIds={[process.env.GG_ANALYTICS_KEY]} />

      {/* merchant analytics */}
      <Analytics
        startScript={startMerchantAnalytics}
        analytics={analyticsRef.current}
      />

      {props.children}
    </>
  );
};

export default LayoutWrapper;
