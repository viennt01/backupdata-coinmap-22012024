import { Image, Skeleton, Button } from 'antd';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import { FALLBACK_IMG } from '@/constants/common';
import ROUTERS from '@/constants/router';
import { formatNumber } from '@/utils/format-number';
import { SvgGroupUser } from '@/assets/images/svg';
import { useRouter } from 'next/router';
import { BOT } from '@/components/home-page/interface';
import { useContext, useMemo } from 'react';
import { AppContext } from '@/app-context';
import useI18n from '@/i18n/useI18N';
import useLocale from '@/hook/use-locale';

interface BotCardProps {
  comingSoon?: boolean;
  botInfo: BOT;
  allowSelectBot?: boolean;
  hideMoreDetail?: boolean;
  handleShowDetail: () => void;
  handleSelectBot?: (bot: BOT) => void;
}

const EXPIRE_STATUS = {
  FIRST_BUY: undefined,
  UNLIMITED: null,
};

const BotCard = ({
  comingSoon,
  botInfo,
  allowSelectBot,
  hideMoreDetail,
  handleShowDetail,
  handleSelectBot,
}: BotCardProps) => {
  const router = useRouter();
  const locale = useLocale();
  const { userInfo } = useContext(AppContext);
  const isUserLogged = !!userInfo?.email;
  const { translate: translateHome } = useI18n('homepage');

  const displayMaxDrawdown = () => {
    // get max precision
    const basePrecision = botInfo.max_drawdown?.split('.')[1]?.length ?? 0;
    const offsetPrecision =
      botInfo.max_drawdown_change_percent?.split('.')[1]?.length ?? 0;
    const precision = Math.max(basePrecision - 2, offsetPrecision - 2, 0);

    // display max drawdown
    const base = Number(botInfo.max_drawdown) * 100.0;
    const offset = Number(botInfo.max_drawdown_change_percent ?? 0) * 100;
    if (offset === 0) return `${base.toFixed(precision)}%`;
    return `${(base - offset).toFixed(precision)}% - ${(base + offset).toFixed(
      precision
    )}%`;
  };

  const handleUseBot = () => {
    router.push(ROUTERS.DASHBOARD);
  };

  const handleClickBuyBot = () => {
    if (!isUserLogged) {
      router.push(ROUTERS.LOGIN);
    } else if (allowSelectBot) {
      handleSelectBot?.(botInfo);
    } else {
      router.push({
        pathname: ROUTERS.PAYMENT,
        query: {
          role_id: botInfo.id,
        },
      });
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
    if (comingSoon) {
      return (
        <CustomButton className={style.actionButton} append={''}>
          {translateHome('section-library.card-button-coming-soon')}
        </CustomButton>
      );
    }

    const now = new Date().getTime();
    switch (expires_at) {
      case EXPIRE_STATUS.FIRST_BUY: {
        return (
          <CustomButton
            className={style.actionButton}
            onClick={handleClickBuyBot}
          >
            {allowSelectBot
              ? translateHome('section-library.card-button-connect-broker')
              : translateHome('section-library.card-button-registers')}
          </CustomButton>
        );
      }
      case EXPIRE_STATUS.UNLIMITED: {
        return (
          <CustomButton className={style.actionButton} onClick={handleUseBot}>
            {translateHome('section-library.card-button-launch')}
          </CustomButton>
        );
      }
      default: {
        if (Number(expires_at) > now) {
          return (
            <CustomButton className={style.actionButton} onClick={handleUseBot}>
              {translateHome('section-library.card-button-launch')}
            </CustomButton>
          );
        } else {
          return (
            <CustomButton
              className={style.actionButton}
              onClick={handleClickBuyBot}
            >
              {translateHome('section-library.card-button-renewal')}
            </CustomButton>
          );
        }
      }
    }
  };

  const translation = botInfo.translation[locale];

  const [description, workBaseOn] = useMemo(() => {
    if (translation) {
      return [translation.description, translation.work_based_on];
    }
    return [botInfo.description, botInfo.work_based_on];
  }, [translation, botInfo]);

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
          <div className={style.description}>{description}</div>
        </div>
      </div>
      <div className={style.midContent}>
        <div className={style.pnlAndDrawdown}>
          <div className={style.pnlWrapper}>
            <div className={style.namePnl}>PnL (%)</div>
            <div className={style.valuePnl}>
              +{formatNumber(Number(botInfo.pnl || 0))}%
            </div>
          </div>
          <div className={style.drawdownWrapper}>
            <div className={style.nameDrawdown}>Maximum drawdown</div>
            <div className={style.valueDrawdown}>{displayMaxDrawdown()}</div>
          </div>
        </div>
        <div className={style.featureName}>
          {translateHome('section-library.card-required')}
        </div>
        <ul className={style.description}>
          {workBaseOn.map((feature: string, index: number) => (
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
          {translateHome('section-library.card-detail')}
        </Button>
        <div className={style.displayPrice}>
          {!!Number(botInfo.display_price || 0) &&
            `$${Number(botInfo.display_price).toLocaleString()}`}
        </div>
        <div className={style.priceAndAction}>
          <div className={style.priceAndTime}>
            <span className={style.price}>{'$' + botInfo.price}</span>
            <span className={style.perTime}>
              {' '}
              /{translateHome('section-library.card-time')}
            </span>
          </div>
          {renderActionButton(botInfo.expires_at)}
        </div>
      </div>
    </div>
  );
};

export default BotCard;
