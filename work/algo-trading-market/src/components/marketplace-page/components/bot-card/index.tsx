import { Image, Skeleton, Button } from 'antd';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import { FALLBACK_IMG } from '@/constants/common';
import ROUTERS from '@/constants/router';
import { formatNumber } from '@/utils/format-number';
import { SvgGroupUser } from '@/assets/images/svg';
import { useRouter } from 'next/router';
import { BOT } from '@/components/marketplace-page/interface';
import { useContext } from 'react';
import { AppContext } from '@/app-context';

interface BotCardProps {
  botInfo: BOT;
  allowSelectBot?: boolean;
  hideMoreDetail?: boolean;
  handleShowDetail: () => void;
  handleBuyBot?: (bot: BOT) => void;
}

const EXPIRE_STATUS = {
  FIRST_BUY: undefined,
  UNLIMITED: null,
};

const BotCard = ({
  botInfo,
  allowSelectBot,
  hideMoreDetail,
  handleShowDetail,
  handleBuyBot,
}: BotCardProps) => {
  const router = useRouter();
  const { userInfo } = useContext(AppContext);
  const isUserLogged = !!userInfo?.email;

  const handleUseBot = () => {
    router.push(ROUTERS.DASHBOARD);
  };

  const handleClickBuyBot = () => {
    if (isUserLogged) {
      handleBuyBot?.(botInfo);
    } else {
      router.push(ROUTERS.LOGIN);
    }
  };

  const renderExpiredTag = (expires_at: string | undefined | null) => {
    const now = new Date().getTime();
    if (Number(expires_at) !== 0 && Number(expires_at) <= now) {
      return <div className={style.expiredTag}>Expired</div>;
    }
    return null;
  };

  const renderActionButton = (expires_at: string | undefined | null) => {
    const now = new Date().getTime();
    switch (expires_at) {
      case EXPIRE_STATUS.FIRST_BUY: {
        return (
          <CustomButton
            className={style.actionButton}
            disabled={!allowSelectBot && isUserLogged}
            onClick={handleClickBuyBot}
          >
            REGISTER
          </CustomButton>
        );
      }
      case EXPIRE_STATUS.UNLIMITED: {
        return (
          <CustomButton className={style.actionButton} onClick={handleUseBot}>
            LAUNCH
          </CustomButton>
        );
      }
      default: {
        if (Number(expires_at) > now) {
          return (
            <CustomButton className={style.actionButton} onClick={handleUseBot}>
              LAUNCH
            </CustomButton>
          );
        } else {
          return (
            <CustomButton
              className={style.actionButton}
              disabled={!allowSelectBot && isUserLogged}
              onClick={handleClickBuyBot}
            >
              RENEWAL
            </CustomButton>
          );
        }
      }
    }
  };

  return (
    <div className={style.tradingBotItem}>
      <div className={style.topContent}>
        <Image
          className={style.image}
          preview={false}
          width={56}
          height={56}
          src={botInfo.image_url}
          alt=""
          fallback={FALLBACK_IMG}
          placeholder={<Skeleton.Image className={style.image} active />}
        />
        <div className={style.titleWrapper}>
          <div className={style.title}>
            <div className={style.name}>
              {botInfo.name} {renderExpiredTag(botInfo.expires_at)}
            </div>
            <div className={style.groupUser}>
              <SvgGroupUser />{' '}
              {formatNumber(botInfo.bought + Number(botInfo.real_bought))}
            </div>
          </div>
          <div className={style.currency}>{botInfo.description}</div>
        </div>
      </div>
      <div className={style.midContent}>
        <div className={style.pnlAndDrawdown}>
          <div className={style.pnlWrapper}>
            <div className={style.namePnl}>PnL (%/year)</div>
            <div className={style.valuePnl}>
              +{formatNumber(Number(botInfo.pnl || 0))}%
            </div>
          </div>
          <div className={style.drawdownWrapper}>
            <div className={style.nameDrawdown}>Maximum drawdown</div>
            <div className={style.valueDrawdown}>
              {formatNumber(Number(botInfo.max_drawdown || 0), 2)}%
            </div>
          </div>
        </div>
        <div className={style.featureName}>Request</div>
        <ul className={style.description}>
          {botInfo.work_based_on.map((feature: string, index: number) => (
            <li className={style.feature} key={index}>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className={style.bottomContent}>
        <Button
          onClick={handleShowDetail}
          className={style.buttonMoreDetails}
          type="link"
          hidden={hideMoreDetail}
        >
          Details
        </Button>
        <div className={style.priceAndAction}>
          <div className={style.priceAndTime}>
            <span className={style.price}>{'$' + botInfo.price}</span>
            <span className={style.perTime}> /MONTH</span>
          </div>
          {renderActionButton(botInfo.expires_at)}
        </div>
      </div>
    </div>
  );
};

export default BotCard;
