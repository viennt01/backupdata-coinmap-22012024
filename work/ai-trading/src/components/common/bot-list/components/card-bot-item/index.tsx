import {
  BOT_STATUS,
  TradeHistoryFilter,
} from '@/components/common/bot-list/interface';
import AppTag, { TagType } from '@/components/tag';
import COLORS from '@/constants/color';
import { ERROR_CODE } from '@/constants/error-code';
import { ERROR_MESSAGE } from '@/constants/message';
import ROUTERS from '@/constants/router';
import { ResponseWithPayload } from '@/fetcher';
import { formatCurrency } from '@/utils/format-number';
import {
  Button,
  Col,
  ConfigProvider,
  Row,
  Switch,
  Popconfirm,
  notification,
  Skeleton,
  Image,
  Statistic,
} from 'antd';
import { useRouter } from 'next/router';
import {
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { BOT } from '../../interface';
import style from './index.module.scss';
import { AppContext } from '@/app-context';
import { FALLBACK_IMG } from '@/constants/common';
import useI18n from '@/i18n/useI18N';
import useModalNotification from '@/hook/modal-notification';

interface Props {
  item: BOT;
  showChart?: boolean;
  width: string | number;
  onClickBotName?: () => void;
  handleOpenConnectBrokerModal: () => void;
  handleUpdateBotStatus: (
    item: BOT,
    status: BOT_STATUS
  ) => Promise<ResponseWithPayload<BOT>>;
  setTradeHistoryFilter?: React.Dispatch<SetStateAction<TradeHistoryFilter>>;
  fetchTradeHistory?: () => void;
}
const description = '';

const BAN_TIME = {
  dev: 1 * 60 * 1000, // 1 minute
  staging: 1 * 60 * 1000, // 1 minute
  production: 3 * 24 * 60 * 60 * 1000, // 3 days
};

const envBanTime =
  BAN_TIME[(process.env.APP_ENV as keyof typeof BAN_TIME) || 'dev'];

export default function CardBotItem({
  item,
  showChart,
  width,
  onClickBotName,
  handleOpenConnectBrokerModal,
  handleUpdateBotStatus,
  setTradeHistoryFilter,
  fetchTradeHistory,
}: Props) {
  // bot to update bot status, no need to render all items;
  const [bot, setBot] = useState<BOT>(item);
  const [apiNotification, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { appTheme, toggleProgressModal } = useContext(AppContext);
  const { translate: translateDashboard } = useI18n('dashboard');
  const { translate } = useI18n();
  const [showBanCountDown, setShowBanCountDown] = useState(true);
  const [modalNotify, renderModalNotification] = useModalNotification();

  useEffect(() => {
    setBot(item);
  }, [item.user_status, setBot]);

  // toggle status of bot
  const handleToggleBot = useCallback(
    (checked: boolean, userStatus?: Omit<BOT_STATUS, BOT_STATUS.ALL>) => {
      let status: BOT_STATUS;
      if (checked) {
        status = BOT_STATUS.ACTIVE;
      } else {
        status = BOT_STATUS.INACTIVE;
      }
      toggleProgressModal();
      handleUpdateBotStatus(bot, status)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            if (userStatus === BOT_STATUS.STOP_OUT) {
              modalNotify.maxDrawdownWarning();
            }
            setBot((prev) => ({
              ...prev,
              user_status: res.payload.status,
            }));
            // refetch trade history when toggle bot status
            if (setTradeHistoryFilter) {
              setTradeHistoryFilter((prev) => {
                if (prev.page === 1) {
                  if (fetchTradeHistory) {
                    fetchTradeHistory();
                  }
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
        })
        .catch((err) => {
          const res = JSON.parse(err.message);
          if (res.error_code === ERROR_CODE.ACCOUNT_NOT_ENOUGH_BALANCE) {
            modalNotify.insufficientAccount(bot.min_balance);
          } else {
            apiNotification.error({
              message: res.message || ERROR_MESSAGE.ERROR,
            });
          }
        })
        .finally(() => toggleProgressModal());
    },
    [handleUpdateBotStatus, bot]
  );
  const handleClickRenewal = () => {
    router.push(ROUTERS.MARKETPLACE);
  };

  const renderButton = useCallback(() => {
    const checked = bot.user_status === BOT_STATUS.ACTIVE;

    const onFinishCountDown = () => {
      setShowBanCountDown(false);
    };

    const ActiveSwitch = () => {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorTextTertiary: COLORS.MULLED_WINE,
              colorTextQuaternary: COLORS.MULLED_WINE,
            },
          }}
        >
          <Popconfirm
            placement="topLeft"
            title={translate('confirm_text')}
            description={description}
            onConfirm={() => handleToggleBot(!checked, bot.user_status)}
            okText={translate('yes')}
            cancelText={translate('no')}
          >
            <Switch
              style={{
                padding: 0,
                color: appTheme.colors.primary,
              }}
              checked={checked}
            />
          </Popconfirm>
        </ConfigProvider>
      );
    };

    switch (bot.user_status) {
      case BOT_STATUS.NOT_ENOUGH_BALANCE: {
        return (
          <>
            <AppTag
              content={translateDashboard(
                'bot_list.card_bot_item.insufficient_balance'
              )}
              type={TagType.WARNING}
            />
            <ActiveSwitch />
          </>
        );
      }
      case BOT_STATUS.ACTIVE: {
        return (
          <>
            <AppTag
              content={translateDashboard('bot_list.card_bot_item.activated')}
              type={TagType.SUCCESS}
            />
          </>
        );
      }
      case BOT_STATUS.INACTIVE: {
        return (
          <>
            <AppTag
              content={translateDashboard(
                'bot_list.card_bot_item.not_activated'
              )}
              type={TagType.DEFAULT}
            />
            {bot.count_inactive_by_system < 3 && <ActiveSwitch />}
          </>
        );
      }
      case BOT_STATUS.CONNECTING: {
        return (
          <>
            <AppTag
              content={translateDashboard('bot_list.card_bot_item.connecting')}
              type={TagType.INFO}
            />
          </>
        );
      }
      case BOT_STATUS.PROCESSING: {
        return (
          <>
            <AppTag
              content={translateDashboard('bot_list.card_bot_item.processing')}
              type={TagType.INFO}
            />
          </>
        );
      }
      case BOT_STATUS.NOT_CONNECT: {
        return (
          <>
            <AppTag
              content={translateDashboard('bot_list.card_bot_item.not_connect')}
              type={TagType.WARNING_}
            />
            <Button
              onClick={handleOpenConnectBrokerModal}
              ghost
              style={{
                padding: 0,
                color: appTheme.colors.on_secondary,
              }}
              type="ghost"
            >
              {translateDashboard('bot_list.card_bot_item.connect_broker')}
            </Button>
          </>
        );
      }
      case BOT_STATUS.DISCONNECTED: {
        return (
          <>
            <AppTag
              content={translateDashboard(
                'bot_list.card_bot_item.disconnected'
              )}
              type={TagType.ERROR}
            />
            <Button
              onClick={handleOpenConnectBrokerModal}
              ghost
              style={{
                padding: 0,
                color: appTheme.colors.on_secondary,
              }}
              type="ghost"
            >
              {translateDashboard('bot_list.card_bot_item.connect_broker')}
            </Button>
          </>
        );
      }
      case BOT_STATUS.EXPIRED: {
        return (
          <>
            <AppTag
              content={translateDashboard('bot_list.card_bot_item.expired')}
              type={TagType.ERROR}
            />
            <Button
              onClick={handleClickRenewal}
              ghost
              style={{
                padding: 0,
                color: appTheme.colors.on_secondary,
              }}
              type="ghost"
            >
              {translateDashboard('bot_list.card_bot_item.renewal')}
            </Button>
          </>
        );
      }
      case BOT_STATUS.INACTIVE_BY_SYSTEM: {
        const { Countdown } = Statistic;
        const banTimeCountdown = Number(bot.inactive_by_system_at) + envBanTime;
        const countdownDistance = (banTimeCountdown || 0) - Date.now();

        return (
          <>
            <AppTag
              content={translateDashboard(
                'bot_list.card_bot_item.not_activated'
              )}
              type={TagType.DEFAULT}
            />
            {bot.count_inactive_by_system === 1 && <ActiveSwitch />}
            {bot.count_inactive_by_system === 2 &&
              (showBanCountDown && countdownDistance > 0 ? (
                <Countdown
                  valueStyle={{
                    color: COLORS.SUNSET_ORANGE,
                    fontSize: '16px',
                  }}
                  value={banTimeCountdown}
                  onFinish={onFinishCountDown}
                />
              ) : (
                <ActiveSwitch />
              ))}
          </>
        );
      }
      case BOT_STATUS.STOP_OUT: {
        return (
          <>
            <AppTag
              content={translateDashboard('bot_list.card_bot_item.stop_out')}
              type={TagType.WARNING}
            />
            {bot.count_inactive_by_system < 3 && <ActiveSwitch />}
          </>
        );
      }
    }
  }, [bot, handleOpenConnectBrokerModal, handleToggleBot, showBanCountDown]);

  const profit = item.balance_current - item.balance_init;
  const gain = (profit / item.balance_init) * 100;

  return (
    <div style={{ width }} className={style.botItemContainer}>
      {contextHolder}
      {renderModalNotification()}
      <div onClick={onClickBotName} className={style.infoContianer}>
        <div className={style.titleContainer}>
          <Image
            className={style.image}
            preview={false}
            width={44}
            height={44}
            src={item.image_url}
            alt=""
            fallback={FALLBACK_IMG}
            placeholder={<Skeleton.Image className={style.image} active />}
          />
          <div className={style.content}>
            <div className={style.name}>{bot.name || '--'}</div>
            <div className={style.botType}>{bot.type}</div>
          </div>
        </div>
        {showChart && (
          <div>
            <svg
              width="100%"
              height="108"
              viewBox="0 0 316 108"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_1364_9100"
                style={{ maskType: 'alpha' }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="316"
                height="108"
              >
                <rect width="316" height="108" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_1364_9100)">
                <path
                  d="M22.3983 85.8193L0.549637 80.4404C-4.49254 79.199 -9.36279 83.0157 -9.36279 88.2084V107.5C-9.36279 111.918 -5.78107 115.5 -1.36279 115.5H319.119C323.537 115.5 327.119 111.918 327.119 107.5V20.3216C327.119 14.9421 321.916 11.0958 316.773 12.6733L282.587 23.1587C281.849 23.385 281.148 23.717 280.505 24.1442L256.068 40.384C255.453 40.7927 254.784 41.1143 254.081 41.3396L211.04 55.1305C209.285 55.6928 207.389 55.6319 205.674 54.958L162.155 37.862C159.263 36.726 155.975 37.3671 153.722 39.5063L138.664 53.8018C137.177 55.2132 135.205 56 133.156 56H91.3329C90.1481 56 88.9781 56.2632 87.9074 56.7705L27.7363 85.2808C26.072 86.0694 24.1866 86.2596 22.3983 85.8193Z"
                  fill="url(#paint0_linear_1364_9100)"
                />
                <path
                  d="M327.705 11.4121C328.761 11.0882 329.355 9.96954 329.031 8.91353C328.707 7.85752 327.588 7.26402 326.532 7.58792L327.705 11.4121ZM280.505 24.1442L279.398 22.4784L280.505 24.1442ZM282.587 23.1587L283.173 25.0708L282.587 23.1587ZM254.081 41.3396L254.691 43.2442L254.081 41.3396ZM256.068 40.384L257.175 42.0497L256.068 40.384ZM205.674 54.958L204.942 56.8195L205.674 54.958ZM153.722 39.5063L152.345 38.0558L153.722 39.5063ZM138.664 53.8018L140.041 55.2523L138.664 53.8018ZM87.9074 56.7705L87.051 54.9631L87.9074 56.7705ZM22.3983 85.8193L21.9202 87.7613L22.3983 85.8193ZM27.7363 85.2808L26.8799 83.4734L27.7363 85.2808ZM-9.8409 79.942L21.9202 87.7613L22.8764 83.8773L-8.88469 76.058L-9.8409 79.942ZM28.5926 87.0882L88.7638 58.5779L87.051 54.9631L26.8799 83.4734L28.5926 87.0882ZM91.3329 58H133.156V54H91.3329V58ZM140.041 55.2523L155.099 40.9567L152.345 38.0558L137.287 52.3514L140.041 55.2523ZM161.424 39.7236L204.942 56.8195L206.405 53.0965L162.886 36.0005L161.424 39.7236ZM211.65 57.0351L254.691 43.2442L253.471 39.435L210.43 53.2258L211.65 57.0351ZM257.175 42.0497L281.612 25.8099L279.398 22.4784L254.961 38.7183L257.175 42.0497ZM283.173 25.0708L327.705 11.4121L326.532 7.58792L282 21.2466L283.173 25.0708ZM281.612 25.8099C282.094 25.4895 282.62 25.2405 283.173 25.0708L282 21.2466C281.078 21.5296 280.201 21.9445 279.398 22.4784L281.612 25.8099ZM254.691 43.2442C255.57 42.9626 256.406 42.5606 257.175 42.0497L254.961 38.7183C254.5 39.0248 253.998 39.266 253.471 39.435L254.691 43.2442ZM204.942 56.8195C207.087 57.6619 209.456 57.7381 211.65 57.0351L210.43 53.2258C209.113 53.6476 207.692 53.602 206.405 53.0965L204.942 56.8195ZM155.099 40.9567C156.789 39.3523 159.255 38.8715 161.424 39.7236L162.886 36.0005C159.271 34.5805 155.161 35.3818 152.345 38.0558L155.099 40.9567ZM133.156 58C135.718 58 138.182 57.0164 140.041 55.2523L137.287 52.3514C136.172 53.4099 134.693 54 133.156 54V58ZM88.7638 58.5779C89.5668 58.1974 90.4443 58 91.3329 58V54C89.8519 54 88.3894 54.329 87.051 54.9631L88.7638 58.5779ZM21.9202 87.7613C24.1555 88.3117 26.5123 88.0739 28.5926 87.0882L26.8799 83.4734C25.6317 84.0648 24.2176 84.2075 22.8764 83.8773L21.9202 87.7613Z"
                  fill="#31AFFE"
                />
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_1364_9100"
                  x1="158.878"
                  y1="9.5"
                  x2="158.878"
                  y2="115.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#31AFFE" />
                  <stop offset="1" stopColor="#31AFFE" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        )}
        <div className={style.contenInfoContainer}>
          <Row justify={'space-between'}>
            <Col>
              <span className={style.key}>ID</span>
            </Col>
            <Col>
              <span className={style.value}>{item.id.slice(-7) || '--'}</span>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col>
              <span className={style.key}>Server</span>
            </Col>
            <Col>
              <span className={style.value}>{item.broker_server || '--'}</span>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col>
              <span className={style.key}>
                {translateDashboard('bot_list.card_bot_item.total_trade')}
              </span>
            </Col>
            <Col>
              <span className={style.value}>{item.total_trade}</span>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col>
              <span className={style.key}>
                {translateDashboard('bot_list.card_bot_item.profit')}
              </span>
            </Col>
            <Col>
              <span
                className={[
                  style.value,
                  style.algae,
                  profit && profit < 0 ? style.down : style.up,
                ].join(' ')}
              >
                {profit && formatCurrency(Number(profit.toFixed(2)))}
              </span>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col>
              <span className={style.key}>
                {translateDashboard('bot_list.card_bot_item.gain')}
              </span>
            </Col>
            <Col>
              <span
                className={[
                  style.value,
                  style.algae,
                  gain && gain < 0 ? style.down : style.up,
                ].join(' ')}
              >
                {(gain || 0).toFixed(2)}%
              </span>
            </Col>
          </Row>
          <Row justify={'space-between'}>
            <Col>
              <span className={style.key}>
                {translateDashboard('bot_list.card_bot_item.balance')}
              </span>
            </Col>
            <Col>
              <span className={[style.value, style.balance].join(' ')}>
                {item && formatCurrency(item.balance)}
              </span>
            </Col>
          </Row>
        </div>
      </div>
      <div className={style.actionContrainer}>{renderButton()}</div>
    </div>
  );
}
