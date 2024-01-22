import {
  Tabs,
  Radio,
  RadioChangeEvent,
  notification,
  ConfigProvider,
  theme,
} from 'antd';
import style from './index.module.scss';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  BOT,
  BOT_STATUS,
  BOT_TYPE,
  DisconnectBroker,
  Filter,
  UpdateBotStatus,
} from './interface';
import BotList from './components/bot-list';
import AppModal from '@/components/modal';
import { AppContext } from '@/app-context';
import BotDetail from './components/bot-detail';
import ConnectBroker from './components/connect-broker';
import Expired from './components/expired';
import InsufficientBalance from './components/insufficient-balance';
import RemoveAccount from './components/remove-account';
import DisconnectBrokerModal from './components/disconnect-broker';
import { useRouter } from 'next/router';
import { getListBots, logoutBroker, updateBotStatus } from './fetcher';
import { ERROR_CODE } from '@/constants/error-code';
import { WSS_EVENTS } from '@/fetcher/ws';
import { throttle } from '@/utils/throttle';
import {
  BannerItem,
  BANNER_TITLE,
} from '@/components/dashboard-page/components/banner';
import { appLocalStorage } from '@/utils/localstorage';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { ResponseWithPayload } from '@/fetcher';
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '@/constants/message';
import { FILTER_STATUS_DATA, TABS_DATA } from './constants';
import { CONNECT_BROKER_TYPES } from '@/constants/common';

interface Props {
  setBannerData?: Dispatch<SetStateAction<BannerItem>>;
}

interface CountBotByStatus {
  [BOT_STATUS.ALL]: number;
  [BOT_STATUS.ACTIVE]: number;
  [BOT_STATUS.NOT_CONNECT]: number;
  [BOT_STATUS.DISCONNECTED]: number;
  [BOT_STATUS.INACTIVE]: number;
}

export default function BotListComponent({ setBannerData }: Props) {
  const { appWebbsocket } = useContext(AppContext);
  const [apiNotification, contextHolder] = notification.useNotification();

  const [filter, setFilter] = useState<Filter>({
    status: BOT_STATUS.ALL,
    type: BOT_TYPE.ALL,
  });

  const [openBotDetail, setOpenBotDetail] = useState(false);
  const [openConnectBroker, setOpenConnectBroker] = useState(false);
  const [openExpired, setOpenExpired] = useState(false);
  const [botDetailSelected, setBotDetailSelected] = useState<BOT | null>(null);
  const [openRemoveAccount, setOpenRemoveAccount] = useState(false);
  const [openInsufficientBalance, setOpenInsufficientBalance] = useState(false);
  const [openDisconnectBroker, setOpenDisconnectBroker] = useState(false);

  const [botList, setBotList] = useState<BOT[] | null>(null);
  const [activeBotList, setActiveBotList] = useState<BOT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);

  const [botsExpired, setBotsExpired] = useState<BOT[]>([]);

  // TODO: add count in tab
  const [, setCountBotByStatus] = useState<CountBotByStatus>({
    [BOT_STATUS.ALL]: 0,
    [BOT_STATUS.ACTIVE]: 0,
    [BOT_STATUS.NOT_CONNECT]: 0,
    [BOT_STATUS.DISCONNECTED]: 0,
    [BOT_STATUS.INACTIVE]: 0,
  });
  const router = useRouter();

  const botListRef = useRef<BOT[]>([]);
  const activeBotListRef = useRef<BOT[]>([]);

  const fetchData = (hasLoading?: boolean) => {
    if (hasLoading) {
      setLoading(true);
      setBotList(null);
    }
    const filterQuery = {
      type: filter.type,
      status:
        FILTER_STATUS_DATA[filter.status as keyof typeof FILTER_STATUS_DATA],
    };
    const queryString = new URLSearchParams(
      filterQuery as unknown as string
    ).toString();
    getListBots(queryString)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const botList = res.payload.map((b) => {
            if (b.user_status === BOT_STATUS.ACTIVE) {
              const profit = b.balance_current / b.balance_init;
              const gain = ((profit / b.balance_init) * 100).toFixed(2);
              return {
                ...b,
                profit: profit.toFixed(2) as unknown as number,
                gain: gain as unknown as number,
              };
            }
            return b;
          });
          setBotList(botList);
          botListRef.current = res.payload;
          // count bot by status
          if (res.payload.length) {
            const countBotByStatus = res.payload.reduce(
              (total, current) => {
                total[BOT_STATUS.ALL] += 1;
                if (current.user_status === BOT_STATUS.ACTIVE) {
                  total[BOT_STATUS.ACTIVE] += 1;
                }
                if (current.user_status === BOT_STATUS.NOT_CONNECT) {
                  total[BOT_STATUS.NOT_CONNECT] += 1;
                }
                if (current.user_status === BOT_STATUS.DISCONNECTED) {
                  total[BOT_STATUS.DISCONNECTED] += 1;
                }
                if (current.user_status === BOT_STATUS.INACTIVE) {
                  total[BOT_STATUS.INACTIVE] += 1;
                }
                return total;
              },
              {
                [BOT_STATUS.ALL]: 0,
                [BOT_STATUS.ACTIVE]: 0,
                [BOT_STATUS.NOT_CONNECT]: 0,
                [BOT_STATUS.DISCONNECTED]: 0,
                [BOT_STATUS.INACTIVE]: 0,
              }
            );
            setCountBotByStatus(countBotByStatus);
            if (firstLoad) {
              handleShowExpiredModalWhenFirstLoad(res.payload);
            }
          }
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      })
      .finally(() => {
        if (hasLoading) {
          setLoading(false);
        }
        if (firstLoad) {
          setFirstLoad(false);
        }
      });
  };

  const handleShowExpiredModalWhenFirstLoad = (botList: BOT[]) => {
    const botsExpired = botList.filter(
      (b) => b.user_status === BOT_STATUS.EXPIRED
    );
    if (botsExpired.length) {
      setBotsExpired(botsExpired);
      setOpenExpired(true);
    }
  };

  const fetchOnlyActiveBot = () => {
    const filterQuery = {
      type: BOT_TYPE.ALL,
      status: BOT_STATUS.ALL,
    };
    const queryString = new URLSearchParams(
      filterQuery as unknown as string
    ).toString();
    getListBots(queryString)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setActiveBotList(res.payload);
          activeBotListRef.current = res.payload;
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      });
  };

  useEffect(() => {
    if (appWebbsocket) {
      // Connection opened and init bot
      appWebbsocket.onopen(() => {
        const token = appLocalStorage.get(LOCAL_STORAGE_KEYS.TOKEN);
        appWebbsocket.sendMesssage(WSS_EVENTS.VERIFY, token);
      });

      appWebbsocket.addEventListener(WSS_EVENTS.VERIFY, () => {
        const filterQuery = {
          type: filter.type,
          status:
            FILTER_STATUS_DATA[
              filter.status as keyof typeof FILTER_STATUS_DATA
            ],
        };
        appWebbsocket.sendMesssage(
          WSS_EVENTS.INIT_BOT,
          JSON.stringify(filterQuery)
        );
      });

      appWebbsocket.addEventListener(WSS_EVENTS.LOGOUT, () => {
        const callback = () => {
          router.push('/login');
        };
        appWebbsocket.logout(callback);
      });

      appWebbsocket.addEventListener(WSS_EVENTS.UPDATE_BOT, (data) => {
        if (data) {
          const bot = data as BOT;
          const botList: BOT[] = botListRef.current.map((b) => {
            if (b.id === bot.id) {
              const profit = bot.balance_current / b.balance_init;
              const gain = ((profit / b.balance_init) * 100).toFixed(2);

              return {
                ...b,
                ...bot,
                profit: profit.toFixed(2) as unknown as number,
                gain: gain as unknown as number,
              };
            }
            return b;
          });
          const activeBots = activeBotListRef.current.map((b) => {
            const profit = bot.balance_current / b.balance_init;
            const gain = ((profit / b.balance_init) * 100).toFixed(2);
            if (b.id === bot.id) {
              return {
                ...b,
                ...bot,
                profit: profit.toFixed(2) as unknown as number,
                gain: gain as unknown as number,
              };
            }
            return b;
          });
          botListRef.current = botList;
          activeBotListRef.current = activeBots;
          throttle(() => {
            setBotList(botListRef.current);
            setActiveBotList(activeBotListRef.current);
          }, 500);
        }
      });
    }
  }, [appWebbsocket, filter]);

  useEffect(() => {
    if (botList && botList.length) {
      // update bot detail in modal, realtime  by wss
      if (botDetailSelected) {
        const botDetail = botList.find((b) => b.id === botDetailSelected.id);
        if (botDetail) {
          setBotDetailSelected(botDetail);
        }
      }
    }
  }, [botList, botDetailSelected]);

  const handleDataSetBanner = (activeBotList: BOT[]) => {
    if (setBannerData) {
      // do not calculate with status NOT_CONNECT and CONNECTING
      const filteredBots = activeBotList.filter(
        (bot) =>
          ![BOT_STATUS.NOT_CONNECT, BOT_STATUS.CONNECTING].includes(
            bot.user_status as BOT_STATUS
          )
      );

      // re calculator when data of bot list changed
      const bannerData = filteredBots.reduce(
        (total, current) => {
          total.totalBalance += current.balance || 0;
          total.totalBalanceCurrent += current.balance_current || 0;
          total.totalBalanceInit += current.balance_init || 0;
          total.totalPNLDayCurrent += current.pnl_day_current || 0;
          total.totalPNLDayInit += current.pnl_day_init || 0;
          total.totalPNL7DayCurrent += current.pnl_7_day_current || 0;
          total.totalPNL7DayInit += current.pnl_7_day_init || 0;
          total.totalPNL30DayCurrent += current.pnl_30_day_current || 0;
          total.totalPNL30DayInit += current.pnl_30_day_init || 0;
          return total;
        },
        {
          totalBalance: 0,
          totalBalanceCurrent: 0,
          totalBalanceInit: 0,
          totalPNLDayCurrent: 0,
          totalPNLDayInit: 0,
          totalPNL7DayCurrent: 0,
          totalPNL7DayInit: 0,
          totalPNL30DayCurrent: 0,
          totalPNL30DayInit: 0,
        }
      );
      setBannerData((prev) => {
        prev[BANNER_TITLE.BALANCE] = {
          ...prev[BANNER_TITLE.BALANCE],
          value: bannerData.totalBalance,
          percent:
            bannerData.totalBalanceInit !== 0
              ? ((bannerData.totalBalanceCurrent -
                  bannerData.totalBalanceInit) /
                  bannerData.totalBalanceInit) *
                100
              : 0,
        };
        prev[BANNER_TITLE.PNL_TODAY] = {
          ...prev[BANNER_TITLE.PNL_TODAY],
          value: bannerData.totalPNLDayCurrent - bannerData.totalPNLDayInit,
          percent:
            bannerData.totalPNLDayInit !== 0
              ? ((bannerData.totalPNLDayCurrent - bannerData.totalPNLDayInit) /
                  bannerData.totalPNLDayInit) *
                100
              : 0,
        };
        prev[BANNER_TITLE.PNL_7D] = {
          ...prev[BANNER_TITLE.PNL_7D],
          value: bannerData.totalPNL7DayCurrent - bannerData.totalPNL7DayInit,
          percent:
            bannerData.totalPNL7DayInit !== 0
              ? ((bannerData.totalPNL7DayCurrent -
                  bannerData.totalPNL7DayInit) /
                  bannerData.totalPNL7DayInit) *
                100
              : 0,
        };
        prev[BANNER_TITLE.PNL_30D] = {
          ...prev[BANNER_TITLE.PNL_30D],
          value: bannerData.totalPNL30DayCurrent - bannerData.totalPNL30DayInit,
          percent:
            bannerData.totalPNL30DayInit !== 0
              ? ((bannerData.totalPNL30DayCurrent -
                  bannerData.totalPNL30DayInit) /
                  bannerData.totalPNL30DayInit) *
                100
              : 0,
        };
        return JSON.parse(JSON.stringify(prev));
      });
    }
  };

  useEffect(() => {
    handleDataSetBanner(activeBotList);
  }, [setBannerData, activeBotList]);

  // update filter from url
  useEffect(() => {
    const { tab, type } = router.query;
    setFilter((prev) => ({
      ...prev,
      type: ((type as string) || BOT_TYPE.ALL).toLocaleUpperCase() as BOT_TYPE,
      status: (
        (tab as string) || BOT_STATUS.ALL
      ).toLocaleUpperCase() as BOT_STATUS,
    }));
  }, [router]);

  useEffect(() => {
    const hasLoading = true;
    fetchData(hasLoading);
  }, [filter]);

  useEffect(() => {
    fetchOnlyActiveBot();
  }, []);

  const onChangeBotType = useCallback(
    (e: RadioChangeEvent) => {
      setFilter((prev) => ({ ...prev, type: e.target.value }));
      router.replace({
        query: {
          ...router.query,
          type: e.target.value.toLocaleLowerCase(),
        },
      });
      // change type and send event init_bot to server
      if (appWebbsocket) {
        const filterQuery = {
          type: e.target.value,
          status:
            FILTER_STATUS_DATA[
              filter.status as keyof typeof FILTER_STATUS_DATA
            ],
        };
        appWebbsocket.sendMesssage(
          WSS_EVENTS.INIT_BOT,
          JSON.stringify(filterQuery)
        );
      }
    },
    [router, appWebbsocket, filter]
  );

  const handleClickTabItem = (key: string) => {
    setFilter((prev) => ({ ...prev, status: key as BOT_STATUS }));
    router.replace({
      query: {
        ...router.query,
        tab: key.toLocaleLowerCase(),
      },
    });
    // change status and send event init_bot to server
    if (appWebbsocket) {
      const filterQuery = {
        type: filter.type,
        status: FILTER_STATUS_DATA[key as keyof typeof FILTER_STATUS_DATA],
      };
      appWebbsocket.sendMesssage(
        WSS_EVENTS.INIT_BOT,
        JSON.stringify(filterQuery)
      );
    }
  };

  const handleOpenConnectBrokerModal = (bot: BOT) => {
    // close bot detail modal
    setOpenBotDetail(false);
    setBotDetailSelected(bot);
    setOpenConnectBroker(true);
  };

  const handleOpenDisconnectBrokerModal = () => {
    setOpenBotDetail(false);
    setOpenDisconnectBroker(true);
  };

  const handleClickBotName = (bot: BOT) => {
    setOpenBotDetail(true);
    setBotDetailSelected(bot);
  };

  const handleUpdateBotStatus = (
    item: BOT,
    status: BOT_STATUS
  ): Promise<ResponseWithPayload<BOT>> => {
    const data: UpdateBotStatus = {
      bot_id: item.id,
      status,
    };
    return updateBotStatus(data).then((res) => {
      if (res.error_code === ERROR_CODE.SUCCESS) {
        if (botListRef.current) {
          const updateBotListRef = botListRef.current.map((b) => {
            if (b.id === item.id) {
              return {
                ...b,
                user_status: status,
              };
            }
            return b;
          });
          botListRef.current = updateBotListRef;
          setBotList(botListRef.current);
        }
        // add or remove bot when updating status: ACTIVE (add) || INACTIVE (remove)
        if (activeBotListRef.current) {
          if (status === BOT_STATUS.ACTIVE) {
            activeBotListRef.current.push({
              ...item,
              user_status: status,
            });
          }
          if (status === BOT_STATUS.INACTIVE) {
            const updateActiveBotListRef = activeBotListRef.current.filter(
              (b) => b.id !== item.id
            );
            activeBotListRef.current = updateActiveBotListRef;
          }
          setActiveBotList(activeBotListRef.current);
        }
      }
      return res;
    });
  };

  const handleLogoutBroker = async () => {
    if (botDetailSelected) {
      const data: DisconnectBroker = {
        bot_id: botDetailSelected.id,
      };
      await logoutBroker(data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            apiNotification.success({
              message: SUCCESS_MESSAGE.SUCCESS,
            });
            setOpenDisconnectBroker(false);

            // remove bot detail
            setBotDetailSelected(null);

            // fetch new bot list
            const hasLoading = true;
            fetchData(hasLoading);
            fetchOnlyActiveBot();
          }
          return res;
        })
        .catch((err) => {
          const res = JSON.parse(err.message);
          apiNotification.error({
            message: res.message || ERROR_MESSAGE.ERROR,
          });
        });
    }
  };

  const operations = useMemo(
    () => (
      <Radio.Group onChange={onChangeBotType} value={filter.type}>
        <Radio value={BOT_TYPE.ALL}>All</Radio>
        <Radio value={BOT_TYPE.FOREX}>Forex</Radio>
        <Radio value={BOT_TYPE.CRYPTO}>Crypto</Radio>
      </Radio.Group>
    ),
    [filter.type, onChangeBotType]
  );
  const items = TABS_DATA.map((item) => {
    return {
      label: <div>{item.title}</div>,
      key: item.key,
      children: (
        <BotList
          data={botList}
          loading={loading}
          handleOpenConnectBrokerModal={handleOpenConnectBrokerModal}
          handleClickBotName={handleClickBotName}
          handleUpdateBotStatus={handleUpdateBotStatus}
        />
      ),
    };
  });

  const renderModalList = useMemo(() => {
    return (
      <>
        <AppModal
          open={openBotDetail}
          close={() => {
            setOpenBotDetail(false);
          }}
        >
          {botDetailSelected && (
            <BotDetail
              botDetailSelected={botDetailSelected}
              handleOpenConnectBrokerModal={handleOpenConnectBrokerModal}
              handleUpdateBotStatus={handleUpdateBotStatus}
              handleOpenDisconnectBrokerModal={handleOpenDisconnectBrokerModal}
            />
          )}
        </AppModal>
        <AppModal
          open={openConnectBroker}
          close={() => setOpenConnectBroker(false)}
        >
          {botDetailSelected && (
            <ConnectBroker
              botSelected={botDetailSelected}
              connectType={CONNECT_BROKER_TYPES.CONNECT}
              onConnected={() => {
                setOpenConnectBroker(false);
                const hasLoading = true;
                fetchData(hasLoading);
              }}
            />
          )}
        </AppModal>
        <AppModal open={openExpired} close={() => setOpenExpired(false)}>
          <Expired botsExpired={botsExpired} />
        </AppModal>
        <AppModal
          open={openInsufficientBalance}
          close={() => setOpenInsufficientBalance(false)}
        >
          <InsufficientBalance
            handleConfirm={() => setOpenInsufficientBalance(false)}
          />
        </AppModal>
        <AppModal
          open={openRemoveAccount}
          close={() => setOpenRemoveAccount(false)}
        >
          <RemoveAccount handleConfirm={() => setOpenRemoveAccount(false)} />
        </AppModal>
        <AppModal
          open={openDisconnectBroker}
          close={() => setOpenDisconnectBroker(false)}
        >
          <DisconnectBrokerModal handleConfirm={handleLogoutBroker} />
        </AppModal>
      </>
    );
  }, [
    openConnectBroker,
    openExpired,
    openInsufficientBalance,
    openRemoveAccount,
    handleOpenConnectBrokerModal,
    botDetailSelected,
    handleUpdateBotStatus,
    handleLogoutBroker,
    botsExpired,
  ]);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      {contextHolder}
      <Tabs
        className={style.tabsContainer}
        onTabClick={handleClickTabItem}
        activeKey={filter.status}
        tabBarExtraContent={operations}
        items={items}
      />
      {renderModalList}
    </ConfigProvider>
  );
}
