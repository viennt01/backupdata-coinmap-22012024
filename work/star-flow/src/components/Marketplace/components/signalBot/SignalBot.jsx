import { Image, Skeleton } from 'antd';
import style from './SignalBot.module.scss';
import { useRouter } from 'next/router';
import { getBotList, getPackageList } from './fetcher';
import { useState, useEffect } from 'react';
import { ERROR_CODE } from '@/fetcher/utils';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import CustomButton from '@/components/Payment/CustomButton';
import { FALLBACK_IMG } from '@/constant/codeConstants';
import { EXPIRE_STATUS } from '@/constant/codeConstants';
import { PAYMENT_TYPES } from '@/constant/codeConstants';
import { BOT_STATUS } from '@/constant/codeConstants';
import { localStore } from '@/utils/localStorage';
import { LOCAL_CACHE_KEYS } from '@/config';
import { calculateAmount } from '@/utils/payment';

const SignBotItem = ({ botInfo, bestPackage }) => {
  const router = useRouter();

  const handleUpgradePackage = () => {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (token) {
      router.push({
        pathname: '/marketplace/payment',
        query: {
          paymentType: PAYMENT_TYPES.SIGNAL_BOT,
          role_id: botInfo.id,
          package_id: '',
        },
      });
    } else {
      router.push('/login');
    }
  };

  const handleLaunchPackage = () => {
    router.push('/signal-bot-dashboard');
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
          <CustomButton
            className={style.launchButton}
            append={<SvgArrowRightLong />}
            onClick={handleLaunchPackage}
          >
            LAUNCH
          </CustomButton>
        );
      }
      default: {
        if (Number(expires_at) > now) {
          return (
            <CustomButton
              className={style.launchButton}
              append={<SvgArrowRightLong />}
              onClick={handleLaunchPackage}
            >
              LAUNCH
            </CustomButton>
          );
        } else {
          return (
            <CustomButton
              append={<SvgArrowRightLong />}
              onClick={handleUpgradePackage}
            >
              RENEWAL
            </CustomButton>
          );
        }
      }
    }
  };

  return (
    <div className={style.signalBotItem}>
      <div className={style.botTag}>{botInfo.type}</div>
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
          <p className={style.description}>{botInfo.description}</p>
        </div>
      </div>
      <div className={style.midContent}>
        <div className={style.featureName}>The Signal work based on</div>
        <ul>
          {botInfo.work_based_on.map((feature, index) => (
            <li className={style.feature} key={index}>
              + {feature}
            </li>
          ))}
        </ul>
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

export default function SignalBot() {
  const [botList, setBotList] = useState([]);
  const [bestPackage, setBestPackage] = useState({});

  useEffect(() => {
    getPackageList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setBestPackage(payload[payload.length - 1]);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getBotList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setBotList(
            payload
              .filter((bot) => bot.status === BOT_STATUS.OPEN)
              .sort((a, b) => a.order - b.order)
          );
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  return (
    <div className={style.signalBotContainer}>
      {botList.map((botInfo, index) => (
        <div className={style.signalBotItemWrapper} key={index}>
          <SignBotItem botInfo={botInfo} bestPackage={bestPackage} />
        </div>
      ))}
    </div>
  );
}
