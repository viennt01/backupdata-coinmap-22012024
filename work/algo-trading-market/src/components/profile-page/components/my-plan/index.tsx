import style from './index.module.scss';
import { Image, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getUserPlanTradingBot } from '@/components/profile-page/fetcher';
import { ERROR_CODE } from '@/constants/error-code';
import { formatLocaleDate } from '@/utils/format-date';
import ROUTERS from '@/constants/router';
import { BotPlan } from '@/components/profile-page/interface';
import CustomButton from '@/components/common/custom-button';

const { Text } = Typography;

const PlanItem = ({ plan }: { plan: BotPlan }) => {
  const router = useRouter();
  const expired = plan.expires_at
    ? plan.expires_at < new Date().getTime()
    : false;

  const handleGoToMarket = () => {
    router.push(ROUTERS.MARKETPLACE);
  };

  return (
    <div className={style.planItemContainer}>
      <div className={style.planItemContentContainer}>
        <div className={style.leftContentContainer}>
          <div className={style.leftWrapper}>
            <div hidden={!plan.image_url}>
              <Image
                width={64}
                height={64}
                preview={false}
                src={plan.image_url}
                alt=""
              />
            </div>
            <div>
              <div className={style.itemName}>{plan.name}</div>
              <p className={style.description}>{plan.description}</p>
            </div>
          </div>
        </div>
        <div className={style.planItemTimeContainerMobile}>
          <div className={style.textContainer}>
            <div
              className={`${style.textTitle} ${expired ? style.expired : ''}`}
            >
              {expired ? 'Expired' : 'Next Payment'}
            </div>
            <div className={style.textDate}>
              {plan.expires_at ? (
                `on ${formatLocaleDate(Number(plan.expires_at))}`
              ) : (
                <Text type="success">Unlimited</Text>
              )}
            </div>
          </div>
          <div onClick={handleGoToMarket} className={style.goToMarketplace}>
            Go to Marketplace →
          </div>
        </div>
        <div className={style.rightContentContainer}>
          <div className={style.rightWrapper}>
            <span className={style.price}>${plan.price}</span>
            <span className={style.perTime}>/MONTH</span>
          </div>
          {expired ? (
            <CustomButton
              className={style.actionButton}
              onClick={handleGoToMarket}
            >
              RENEWAL
            </CustomButton>
          ) : (
            <CustomButton
              className={style.actionButton}
              onClick={() => router.push(ROUTERS.DASHBOARD)}
            >
              LAUNCH
            </CustomButton>
          )}
        </div>
      </div>

      <div className={style.planItemTimeContainer}>
        <div className={style.textContainer}>
          <div className={`${style.textTitle} ${expired ? style.expired : ''}`}>
            {expired ? 'Expired' : 'Next Payment'}
          </div>
          <div className={style.textDate}>
            {plan.expires_at ? (
              `on ${formatLocaleDate(Number(plan.expires_at))}`
            ) : (
              <Text type="success">Unlimited</Text>
            )}
          </div>
        </div>
        <div onClick={handleGoToMarket} className={style.goToMarketplace}>
          Go to Marketplace →
        </div>
      </div>
    </div>
  );
};

export default function MyPlans() {
  const [yourPlan, setYourPlan] = useState<BotPlan[]>([]);

  const fetchData = async () => {
    try {
      const res = await getUserPlanTradingBot();
      if (res?.error_code === ERROR_CODE.SUCCESS) {
        const roleList = res.payload.map((item) => ({
          image_url: item.image_url,
          name: item.name,
          expires_at: item.expires_at,
          description: item.description,
          price: item.price,
          type: item.type,
          currency: item.currency,
          quantity: item.quantity,
        }));
        setYourPlan(roleList);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1 className={style.title}>
        My plans <span className={style.planNumber}>({yourPlan.length})</span>
      </h1>
      <div>
        {yourPlan.map((plan, i) => (
          <PlanItem key={i} plan={plan} />
        ))}
      </div>
    </div>
  );
}
