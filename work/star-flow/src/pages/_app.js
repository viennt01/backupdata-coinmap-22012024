import { Provider } from 'react-redux';
import Head from 'next/head';
import { StrictMode } from 'react';
import { useStore } from '../store';

import { SSRProvider } from '@react-aria/ssr';
import Header from '@/components/Menu/Menu';
import ErrorHandler from '@/components/ErrorHandler';
import GlobalFooter from '@/components/Footer';
import logo from '@/assets/images/logo/logo.png';
import ability from '@/utils/authorize/ability';
import { AbilityContext } from '@/utils/authorize/can';
import ErrorBoundary from '@/components/ErrorBoundary';
// get token from localstogret set for header in uploadFile
import useBaseData from '@/hook/base-data';
import Loading from '@/components/Loading';
import PopupUpgradeYourPlan from '@/components/PopupUpgradeYourPlan/PopupUpgradeYourPlan';
import LayoutWrapper from '@/components/LayoutWrapper';
import UserGuide from '@/components/UserGuide';
import pageAbility from '@/utils/pagePermission/ability';
import { PageAbilityContext } from '@/utils/pagePermission/can';

import '@/assets/scss/style.scss';
import 'antd/dist/reset.css';

const Layout = ({ children }) => {
  const [
    loading,
    showNeedUpgradePlan,
    handleShowNeedUpgradePlan,
    openUserGuide,
    setOpenUserGuide,
    userInfo,
  ] = useBaseData();

  return (
    <ErrorBoundary>
      <div>
        <Header />
        <StrictMode>{children}</StrictMode>
        <GlobalFooter />
        {loading && <Loading />}
        <PopupUpgradeYourPlan
          show={showNeedUpgradePlan}
          setShow={handleShowNeedUpgradePlan}
        />
        <UserGuide
          openUserGuide={openUserGuide}
          setOpenUserGuide={setOpenUserGuide}
          userInfo={userInfo}
        />
      </div>
    </ErrorBoundary>
  );
};

export default function App({ Component, pageProps }) {
  const store = useStore(pageProps.initialReduxState);
  const L = Component.Layout ? Component.Layout : Layout;

  return (
    <>
      <SSRProvider>
        <Provider store={store}>
          <PageAbilityContext.Provider value={pageAbility}>
            <AbilityContext.Provider value={ability}>
              <Head>
                <meta
                  name="viewport"
                  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
                <meta
                  name="viewport"
                  content="width=device-width, user-scalable=no"
                />
                <link rel="favicon" href={logo.src} />
                <link rel="shortcut icon" href={logo.src} />
              </Head>
              <LayoutWrapper>
                <L>
                  <>
                    <Component {...pageProps} />
                    <ErrorHandler {...pageProps} />
                  </>
                </L>
              </LayoutWrapper>
            </AbilityContext.Provider>
          </PageAbilityContext.Provider>
        </Provider>
      </SSRProvider>
    </>
  );
}
