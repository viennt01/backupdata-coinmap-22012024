import { Image, Skeleton, Button } from 'antd';
import style from './BotCard.module.scss';
import { useRouter } from 'next/router';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import CustomButton from '@/components/Payment/CustomButton';
import { FALLBACK_IMG } from '@/constant/codeConstants';
import { EXPIRE_STATUS } from '@/constant/codeConstants';
import { PAYMENT_TYPES } from '@/constant/codeConstants';
import { useSelector } from 'react-redux';
import { localStore } from '@/utils/localStorage';
import { LOCAL_CACHE_KEYS } from '@/config';
import { calculateAmount } from '@/utils/payment';

const generateTradingBotUrl = (domain) =>
  (domain ?? window.origin) + '/trading-bot';

const BotCard = ({
  botInfo,
  bestPackage,
  handleShowDetail,
  hideMoreDetail,
}) => {
  const router = useRouter();
  const merchantInfo = useSelector((state) => state.common.merchantInfo);

  const handleUpgradePackage = () => {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (token) {
      router.push({
        pathname: '/marketplace/payment',
        query: {
          paymentType: PAYMENT_TYPES.TRADING_BOT,
          role_id: botInfo.id,
          package_id: '',
        },
      });
    } else {
      router.push('/login');
    }
  };

  const renderExpiredTag = (expires_at) => {
    const now = new Date().getTime();
    if (Number(expires_at) !== 0 && Number(expires_at) <= now) {
      return <div className={style.expiredTag}>Expired</div>;
    }
    return null;
  };

  const renderActionButton = (expires_at) => {
    const now = new Date().getTime();
    switch (expires_at) {
      case EXPIRE_STATUS.FIRST_BUY: {
        return (
          <CustomButton
            append={<SvgArrowRightLong />}
            onClick={handleUpgradePackage}
          >
            GET IT
          </CustomButton>
        );
      }
      case EXPIRE_STATUS.UNLIMITED: {
        return (
          <a
            target="_blank"
            href={generateTradingBotUrl(merchantInfo.profile.domain)}
            rel="noreferrer"
          >
            <CustomButton
              className={style.launchButton}
              append={<SvgArrowRightLong />}
            >
              LAUNCH
            </CustomButton>
          </a>
        );
      }
      default: {
        if (Number(expires_at) > now) {
          return (
            <a
              target="_blank"
              href={generateTradingBotUrl(merchantInfo.profile.domain)}
              rel="noreferrer"
            >
              <CustomButton
                className={style.launchButton}
                append={<SvgArrowRightLong />}
              >
                LAUNCH
              </CustomButton>
            </a>
          );
        } else {
          return (
            <CustomButton
              append={<SvgArrowRightLong />}
              onClick={handleUpgradePackage}
            >
              RENEWAL <SvgArrowRightLong />
            </CustomButton>
          );
        }
      }
    }
  };

  return (
    <div className={style.tradingBotItem}>
      <div className={style.topContent}>
        <div>
          <Image
            className={style.image}
            preview={false}
            width={100}
            height={100}
            src={botInfo.image_url}
            alt=""
            fallback={FALLBACK_IMG}
            placeholder={<Skeleton.Image className={style.image} active />}
          />
        </div>
        <div>
          <div className={style.name}>
            {botInfo.name} {renderExpiredTag(botInfo.expires_at)}
          </div>
          <p className={style.currency}>
            {botInfo.token_first}
            {botInfo.token_second}
          </p>
        </div>
      </div>
      <div className={style.midContent}>
        <div className={style.midContentLeft}>
          <div className={style.namePnl}>PnL (%)</div>
          <div className={style.valuePnl}>+{botInfo.pnl || 0}%</div>
          <div className={style.featureName}>Requirement</div>
          <ul className={style.description}>
            <ul>
              {botInfo.work_based_on.map((feature, index) => (
                <li className={style.feature} key={index}>
                  + {feature}
                </li>
              ))}
            </ul>
          </ul>
          <Button
            onClick={handleShowDetail}
            className={style.buttonMoreDetails}
            type="link"
            hidden={hideMoreDetail}
          >
            More details
          </Button>
        </div>
        <div className={style.midContentRight}>
          <div className={style.nameDrawdown}>Max drawdown</div>
          <div className={style.valueDrawdown}>
            {botInfo.max_drawdown || 0}%
          </div>
        </div>
      </div>
      <div className={style.bottomContent}>
        <div>
          <span className={style.price}>
            {'$' +
              calculateAmount(
                botInfo.price,
                1,
                bestPackage.discount_rate,
                bestPackage.discount_amount
              )}
          </span>
          <span className={style.perTime}> /MO</span>
        </div>
        <div>{renderActionButton(botInfo.expires_at)}</div>
      </div>
    </div>
  );
};

export default BotCard;
