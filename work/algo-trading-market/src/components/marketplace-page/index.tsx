import style from './index.module.scss';
import {
  getTradingBotList,
  getAppSetting,
} from '@/components/marketplace-page/fetcher';
import { useState, useEffect, useMemo } from 'react';
import { ERROR_CODE } from '@/constants/error-code';
import BotCard from './components/bot-card';
import { BOT } from '@/components/marketplace-page/interface';
import { APP_SETTINGS, CONNECT_BROKER_TYPES } from '@/constants/common';
import AppModal from '@/components/modal';
import { useRouter } from 'next/router';
import ROUTERS from '@/constants/router';
import ConnectBroker from '@/components/common/bot-list/components/connect-broker';
import BacktestTab from '@/components/marketplace-page/components/backtest-tab';
import { Tabs, Typography } from 'antd';

const { Title } = Typography;

enum DETAIL_TABS {
  BACK_TEST = 'BACK_TEST',
}

export default function BotList() {
  const router = useRouter();
  const [botList, setBotList] = useState<BOT[]>([]);
  const [allowSelectBot, setAllowSelectBot] = useState(false);
  const [openConnectBroker, setOpenConnectBroker] = useState(false);
  const [openBotDetail, setOpenBotDetail] = useState(false);
  const [activeTab, setActiveTab] = useState(DETAIL_TABS.BACK_TEST);
  const [botSelected, setBotDetailSelected] = useState<BOT | null>(null);

  const items = useMemo(
    () => [
      {
        label: <div>Backtest report</div>,
        key: DETAIL_TABS.BACK_TEST,
        children: <BacktestTab botSelected={botSelected} />,
      },
    ],
    [botSelected]
  );

  const fetchBotList = () => {
    getTradingBotList()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setBotList(res.payload);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const fetchBotSettings = async () => {
    Promise.all([
      getAppSetting(APP_SETTINGS.NUMBER_OF_TBOT),
      getAppSetting(APP_SETTINGS.NUMBER_OF_TBOT_USED),
    ])
      .then(([availableBotRes, usedBotRes]) => {
        if (
          availableBotRes.error_code === ERROR_CODE.SUCCESS &&
          usedBotRes.error_code === ERROR_CODE.SUCCESS
        ) {
          const numberOfAvailableBot = Number(
            availableBotRes.payload.value || 0
          );
          const numberOfUsedBot = Number(usedBotRes.payload.value || 0);
          if (numberOfAvailableBot > numberOfUsedBot) setAllowSelectBot(true);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  const handleBuyBot = (bot: BOT) => {
    setBotDetailSelected(bot);
    setOpenConnectBroker(true);
  };

  const handleShowDetailModal = (bot: BOT) => {
    setActiveTab(DETAIL_TABS.BACK_TEST);
    setBotDetailSelected(bot);
    setOpenBotDetail(true);
  };

  const handleClickTabItem = (key: string) => {
    setActiveTab(key as DETAIL_TABS);
  };

  useEffect(() => {
    fetchBotList();
    fetchBotSettings();
  }, []);

  return (
    <section id="marketplace" className={style.wrapper}>
      <div className="container">
        <div className={style.title}>Smart, Precise, and Profitable</div>
        <div className={style.description}>
          The best way of maximizing returns
        </div>
        <div className={style.botList}>
          {botList.map((botInfo, index) => (
            <div className={style.botItem} key={index}>
              <BotCard
                botInfo={botInfo}
                allowSelectBot={allowSelectBot}
                handleShowDetail={() => handleShowDetailModal(botInfo)}
                handleBuyBot={handleBuyBot}
              />
            </div>
          ))}
        </div>
      </div>
      <AppModal
        open={openConnectBroker}
        close={() => setOpenConnectBroker(false)}
      >
        {botSelected && (
          <ConnectBroker
            botSelected={botSelected as any}
            connectType={CONNECT_BROKER_TYPES.SELECT_AND_CONNECT}
            onConnected={() => {
              router.push(ROUTERS.DASHBOARD);
            }}
          />
        )}
      </AppModal>
      <AppModal open={openBotDetail} close={() => setOpenBotDetail(false)}>
        <div className={style.detailModalContainer}>
          <Title>A.I Trading details</Title>
          <Tabs
            className={style.tabsContainer}
            onTabClick={handleClickTabItem}
            activeKey={activeTab}
            items={items}
          />
        </div>
      </AppModal>
    </section>
  );
}
