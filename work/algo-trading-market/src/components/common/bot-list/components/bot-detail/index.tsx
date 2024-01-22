import CardBotItem from '../card-bot-item';
import style from './index.module.scss';
import {
  BOT_STATUS,
  Currency,
  PnlData,
  TradeHistory,
  TradeHistoryFilter,
} from '@/components/common/bot-list/interface';
import { AppContext } from '@/app-context';

import {
  Button,
  ConfigProvider,
  Row,
  Typography,
  Popconfirm,
  Card,
} from 'antd';
import TradeHistoryTable from './trading-histoy';
import { BOT } from '../../interface';
import { ResponseWithPayload } from '@/fetcher';
import COLORS from '@/constants/color';
import { getCurrencyList, getTradeHistory, getPnlData } from '../../fetcher';
import { useContext, useEffect, useState } from 'react';
import { ERROR_CODE } from '@/constants/error-code';
import { WSS_EVENTS } from '@/fetcher/ws';
import { formatDate } from '@/utils/format-date';
import dynamic from 'next/dynamic';
import { formatCurrency } from '@/utils/format-number';

const Line = dynamic(
  () => import('@ant-design/plots').then(({ Line }) => Line),
  { ssr: false }
);

const { Title } = Typography;

const text = 'Are you sure to do this?';
const description = '';

interface BotTradeUpdate extends BOT {
  bot_id: string;
}

interface Props {
  handleOpenConnectBrokerModal: (bot: BOT) => void;
  botDetailSelected: BOT;
  handleUpdateBotStatus: (
    item: BOT,
    status: BOT_STATUS
  ) => Promise<ResponseWithPayload<BOT>>;
  handleOpenDisconnectBrokerModal: () => void;
}

export default function BotDetail({
  handleOpenConnectBrokerModal,
  botDetailSelected,
  handleUpdateBotStatus,
  handleOpenDisconnectBrokerModal,
}: Props) {
  const [tradeHistoryFilter, setTradeHistoryFilter] =
    useState<TradeHistoryFilter>({
      page: 1,
      size: 10,
      total: 0,
      bot_id: botDetailSelected.id,
    });
  const [tradeHistory, setTradeHistory] = useState<TradeHistory[] | null>(null);
  const [currencyList, setCurrencyList] = useState<Currency[] | null>(null);
  const { appWebbsocket } = useContext(AppContext);
  const [pnlData, setPnlData] = useState<PnlData[]>([]);

  const fetchTradeHistory = () => {
    const queryString = new URLSearchParams(
      tradeHistoryFilter as unknown as string
    ).toString();
    getTradeHistory(queryString)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTradeHistory(res.payload.rows);
          setTradeHistoryFilter((prev) => ({
            ...prev,
            total: res.payload.total,
          }));
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchPnlData = (botId: string) => {
    getPnlData(botId)
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setPnlData(
            payload.map((item) => ({
              ...item,
              xValue: formatDate(Number(item.updated_at), 'DD/MM/YYYY'), // must be formatted as 'DD/MM/YYYY' to display tooltip in chart
            }))
          );
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    appWebbsocket?.addEventListener(WSS_EVENTS.TRADE_UPDATE, (data) => {
      if (botDetailSelected) {
        const bot = data as BotTradeUpdate;
        if (bot.bot_id === botDetailSelected.id) {
          // trigger to refetch new list
          setTradeHistoryFilter((prev) => {
            if (prev.page === 1) {
              fetchTradeHistory();
              return prev;
            } else {
              return {
                ...prev,
                page: 1,
              };
            }
          });
        }
      }
    });

    return () => {
      appWebbsocket?.removeEventListener(WSS_EVENTS.TRADE_UPDATE);
    };
  }, [appWebbsocket, botDetailSelected, fetchTradeHistory]);

  const fetchCurrencyList = () => {
    getCurrencyList()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setCurrencyList(res.payload);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchCurrencyList();
    fetchPnlData(botDetailSelected.id);
  }, []);

  useEffect(() => {
    fetchTradeHistory();
  }, [tradeHistoryFilter.page]);

  const handleUpdatePnlData = (data: any) => {
    const bot = data as BotTradeUpdate;
    if (bot.bot_id !== botDetailSelected.id) return;
    fetchPnlData(botDetailSelected.id);
  };

  // setting socket to receive update data of trade and pnl
  useEffect(() => {
    appWebbsocket?.addEventListener(WSS_EVENTS.PNL_UPDATE, handleUpdatePnlData);

    return () => {
      appWebbsocket?.removeEventListener(WSS_EVENTS.PNL_UPDATE);
    };
  });

  return (
    <div style={{ width: '100%' }} className={style.botDetailContainer}>
      <Row justify="space-between" align="middle">
        <Title>A.I Trading details</Title>

        {(botDetailSelected.user_status === BOT_STATUS.DISCONNECTED ||
          botDetailSelected.user_status === BOT_STATUS.NOT_CONNECT) && (
          <Button
            style={{ marginBottom: 20 }}
            onClick={() => handleOpenConnectBrokerModal(botDetailSelected)}
            ghost
            type="primary"
          >
            Connect broker
          </Button>
        )}

        {(botDetailSelected.user_status === BOT_STATUS.ACTIVE ||
          botDetailSelected.user_status === BOT_STATUS.INACTIVE) && (
          <ConfigProvider
            theme={{
              token: {
                colorTextTertiary: COLORS.MULLED_WINE,
                colorTextQuaternary: COLORS.MULLED_WINE,
              },
            }}
          >
            <Popconfirm
              placement="bottomRight"
              title={text}
              description={description}
              onConfirm={handleOpenDisconnectBrokerModal}
              okText="Yes"
              cancelText="No"
            >
              <Button style={{ marginBottom: 20 }} danger ghost type="primary">
                Disconnect broker
              </Button>
            </Popconfirm>
          </ConfigProvider>
        )}
      </Row>
      <div className={style.infoContainer}>
        <div className={style.leftInfoContainer}>
          <CardBotItem
            width="100%"
            item={botDetailSelected}
            handleOpenConnectBrokerModal={() =>
              handleOpenConnectBrokerModal(botDetailSelected)
            }
            handleUpdateBotStatus={handleUpdateBotStatus}
          />
        </div>
        <div className={style.rightInfoContainer}>
          <Card bordered={false} style={{ minHeight: 300 }}>
            <Title level={5} style={{ textAlign: 'center' }}>
              {`Cumulative PNL`}
            </Title>
            <Line
              smooth
              height={240}
              data={pnlData}
              animation={false}
              xField="xValue"
              yField="pnl_day_cash"
              color={COLORS.ALGAE}
              yAxis={{
                grid: null,
                label: {
                  style: { fill: 'white' },
                  formatter: (value: string) =>
                    formatCurrency(Number(value || 0)),
                },
              }}
              xAxis={{
                label: {
                  style: { fill: 'white' },
                },
              }}
              tooltip={{
                formatter: (datum: any) => {
                  return {
                    name: 'Cumulative PNL',
                    value: formatCurrency(Number(datum.pnl_day_cash || 0)),
                  };
                },
                customItems: (originalItems: any) => {
                  const { pnl_day_cash } = originalItems[0].data;
                  originalItems[0].color =
                    Number(pnl_day_cash) < 0
                      ? COLORS.SUNSET_ORANGE
                      : COLORS.ALGAE;
                  return originalItems;
                },
              }}
              annotations={[
                {
                  type: 'regionFilter',
                  start: ['min', 'min'],
                  end: ['max', '0'],
                  color: COLORS.SUNSET_ORANGE,
                },
              ]}
            />
          </Card>
        </div>
      </div>
      <div className={style.tradingHistoryContainer}>
        <TradeHistoryTable
          tradeHistoryFilter={tradeHistoryFilter}
          tradeHistory={tradeHistory}
          currencyList={currencyList}
          setTradeHistoryFilter={setTradeHistoryFilter}
        />
      </div>
    </div>
  );
}
