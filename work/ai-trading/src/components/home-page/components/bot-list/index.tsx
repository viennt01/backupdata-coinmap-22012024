import style from './index.module.scss';
import {
  getTradingBotList,
  getAppSetting,
} from '@/components/home-page/fetcher';
import { useState, useEffect, useMemo, useContext } from 'react';
import { ERROR_CODE } from '@/constants/error-code';
import BotCard from './components/bot-card';
import { BOT } from '@/components/home-page/interface';
import { APP_SETTINGS, CONNECT_BROKER_TYPES } from '@/constants/common';
import AppModal from '@/components/modal';
import { useRouter } from 'next/router';
import ROUTERS from '@/constants/router';
import ConnectBroker from '@/components/common/bot-list/components/connect-broker';
import BacktestTab from '@/components/home-page/components/backtest-tab';
import { Tabs, Typography } from 'antd';
import useI18n from '@/i18n/useI18N';
import { AppContext } from '@/app-context';

const { Title } = Typography;

interface Props {
  comingSoon?: boolean;
  title: string;
  description?: string;
}

enum DETAIL_TABS {
  BACK_TEST = 'BACK_TEST',
}

export default function BotList({ comingSoon, title, description }: Props) {
  const router = useRouter();
  const [botList, setBotList] = useState<BOT[]>([]);
  const [allowSelectBot, setAllowSelectBot] = useState(false);
  const [openConnectBroker, setOpenConnectBroker] = useState(false);
  const [openBotDetail, setOpenBotDetail] = useState(false);
  const [activeTab, setActiveTab] = useState(DETAIL_TABS.BACK_TEST);
  const [botSelected, setBotDetailSelected] = useState<BOT | null>(null);
  const { translate } = useI18n();
  const { merchantInfo } = useContext(AppContext);

  const items = useMemo(
    () => [
      {
        label: <div>{translate('report_backtest')}</div>,
        key: DETAIL_TABS.BACK_TEST,
        children: <BacktestTab botSelected={botSelected} />,
      },
    ],
    [botSelected, translate]
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

  const handleSelectBot = (bot: BOT) => {
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
      <div
        className={`${style.background} ${
          !merchantInfo?.config.hide_background_texture ? style.image : ''
        }`}
      />
      <div className="container">
        <div className={style.title}>{title}</div>
        {description && <div className={style.description}>{description}</div>}
        <div className={style.botList}>
          {botList.map((botInfo, index) => (
            <div className={style.botItem} key={index}>
              <BotCard
                comingSoon={comingSoon}
                botInfo={botInfo}
                allowSelectBot={allowSelectBot}
                handleShowDetail={() => handleShowDetailModal(botInfo)}
                handleSelectBot={handleSelectBot}
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
          <Title className={style.detailModalTitle}>
            {translate('detail_trading_ai')}
          </Title>
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
