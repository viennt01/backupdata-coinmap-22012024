import { Tabs, ConfigProvider } from 'antd';
import SignalBot from './components/signalBot/SignalBot';
import TradingBot from './components/tradingBot/TradingBot';
import style from './index.module.scss';
import { FEATURE_ID } from '@/config/consts/pagePermission';
import { useMemo, useState, useEffect } from 'react';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const tabItems = [
  {
    label: `Signal bot`,
    key: FEATURE_ID.BOT_SIGNAL,
    children: <SignalBot />,
  },
  {
    label: `Trading Bot`,
    key: FEATURE_ID.BOT_TRADING,
    children: <TradingBot />,
  },
];

export default function Marketplace() {
  const pageAbility = useAbility(PageAbilityContext);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);
  const [activatedTab, setActivatedTab] = useState(FEATURE_ID.BOT_SIGNAL);
  const router = useRouter();

  const filteredTabItems = useMemo(() => {
    return !merchantInfo.checkPermission
      ? tabItems
      : tabItems.filter((item) =>
          pageAbility.can(PERMISSION_ACTIONS.VIEW, item.key)
        );
  }, [merchantInfo, pageAbility]);

  // update filter from url
  useEffect(() => {
    const { tab } = router.query;
    if (merchantInfo.checkPermission) {
      if (tab) {
        setActivatedTab(tab.toLocaleUpperCase());
      } else {
        setActivatedTab(FEATURE_ID.BOT_TRADING);
      }
    } else {
      if (tab) {
        setActivatedTab(tab.toLocaleUpperCase());
      }
    }
  }, [router, merchantInfo.checkPermission]);

  const handleClickTabItem = (tab) => {
    setActivatedTab(tab);
    router.replace({
      query: {
        ...router.query,
        tab: tab.toLocaleLowerCase(),
      },
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'Montserrat',
        },
      }}
    >
      <div className={style.container}>
        <div className={`${style.contentContainer} cm-container-v2`}>
          <div className={style.content}>
            <h1>Speedy, Precise, and Automated</h1>
            <p>The best way of maximizing returns</p>
          </div>
          <Tabs
            size="large"
            activeKey={activatedTab}
            onTabClick={handleClickTabItem}
            centered
            className={style.tabBarStyle}
            items={filteredTabItems}
          />
        </div>
      </div>
    </ConfigProvider>
  );
}
