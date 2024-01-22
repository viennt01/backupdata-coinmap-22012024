import { Button, Image, ConfigProvider, Typography } from 'antd';
import style from './my-plans.module.scss';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  getUserBotPlans,
  getUserRolePlans,
  getUserTradingBotPlans,
} from '../fetcher';
import { ERROR_CODE } from '@/fetcher/utils';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';

const { Text } = Typography;

const CATEGORY = {
  SBOT: 'SBOT',
  TBOT: 'TBOT',
  PACKAGE: 'PACKAGE',
};

function getPriod(quantity) {
  switch (quantity) {
    case 14: {
      return '14 Days';
    }
    case 1: {
      return '1 Month';
    }
    default: {
      if (quantity) {
        return quantity + 'Months';
      }
      return null;
    }
  }
}

const FORMAT_STRING = 'do MMMM, yyyy';

const PlanItem = ({ plan }) => {
  const router = useRouter();
  const expired = plan.expires_at
    ? plan.expires_at < new Date().getTime()
    : false;

  const handleGoToMarket = () => {
    if (plan.category === CATEGORY.SBOT) {
      router.push('/marketplace?tab=bot_signal');
    }
    if (plan.category === CATEGORY.TBOT) {
      router.push('/marketplace?tab=bot_trading');
    }
    if (plan.category === CATEGORY.PACKAGE) {
      router.push('/pricing');
    }
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
        <div className={style.rightContentContainer}>
          <div className={style.rightWrapper}>
            <span className={style.price}>${plan.price}</span>
            <span className={style.perTime}>
              /{`${getPriod(plan.quantity) || 'Monthly'}`}
            </span>
          </div>
          <div className={style.button}>
            {expired ? (
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#FE842B',
                  },
                }}
              >
                <Button onClick={handleGoToMarket} size="large" type="primary">
                  Renewal
                </Button>
              </ConfigProvider>
            ) : (
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#B02BFE',
                  },
                }}
              >
                <Button
                  onClick={() => {
                    if (plan.category === CATEGORY.SBOT) {
                      router.push('/signal-bot-dashboard');
                    }
                    if (plan.category === CATEGORY.TBOT) {
                      window.open(`${window.location.origin}/trading-bot`);
                    }
                    if (plan.category === CATEGORY.PACKAGE) {
                      router.push('/chart');
                    }
                  }}
                  size="large"
                  type="primary"
                >
                  Run
                </Button>
              </ConfigProvider>
            )}
          </div>
        </div>
      </div>

      <div className={style.planItemTimeContainer}>
        <div className={style.textContainer}>
          <div className={style.textTitle}>Expired</div>
          <div className={style.textDate}>
            {plan.expires_at ? (
              ` on ${format(Number(plan.expires_at), FORMAT_STRING)}`
            ) : (
              <Text type="success">UNLIMITED</Text>
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
  const pageAbility = useAbility(PageAbilityContext);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);
  const [yourPlan, setYourPlan] = useState([]);

  const canIView = (featureId) =>
    !merchantInfo.checkPermission ||
    pageAbility.can(PERMISSION_ACTIONS.VIEW, featureId);

  const fetchData = async () => {
    try {
      const promise = [
        getUserBotPlans(),
        getUserRolePlans(),
        getUserTradingBotPlans(),
      ];

      const res = await Promise.all(promise);
      if (
        canIView(FEATURE_ID.BOT_SIGNAL) &&
        res?.[0].error_code === ERROR_CODE.SUCCESS
      ) {
        const botList = res[0].payload.map((item) => ({
          image_url: item.image_url,
          name: item.name,
          expires_at: item.expires_at,
          description: item.description,
          price: item.price,
          type: item.type,
          currecy: item.currecy,
          category: CATEGORY.SBOT,
        }));
        setYourPlan(botList);
      }
      if (
        canIView(FEATURE_ID.PAGE_PRICING) &&
        res?.[1].error_code === ERROR_CODE.SUCCESS
      ) {
        const roleList = res[1].payload.map((item) => ({
          image_url: '',
          name: item.role_name,
          expires_at: item.expires_at,
          description: item.description,
          price: item.price,
          type: item.type,
          currecy: item.currecy,
          category: CATEGORY.PACKAGE,
        }));
        setYourPlan((prev) => [...prev, ...roleList]);
      }
      if (
        canIView(FEATURE_ID.BOT_TRADING) &&
        res?.[2].error_code === ERROR_CODE.SUCCESS
      ) {
        const roleList = res[2].payload.map((item) => ({
          image_url: item.image_url,
          name: item.name,
          expires_at: item.expires_at,
          description: item.description,
          price: item.price,
          type: item.type,
          currecy: item.currecy,
          category: CATEGORY.TBOT,
        }));
        setYourPlan((prev) => [...prev, ...roleList]);
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
      <h1>My Plan</h1>
      <div>
        {yourPlan.map((plan, i) => (
          <PlanItem key={i} plan={plan} />
        ))}
      </div>
    </div>
  );
}
