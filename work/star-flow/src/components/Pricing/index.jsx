import { ERROR_CODE } from '@/fetcher/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getPackageList, getRoleList, postUpgradeTrial } from './fetcher';

import ChooseYourPlan from './components/ChooseYourPlan/ChooseYourPlan';
import CardPricing from '../CardPricing';
import styled from './style.module.scss';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';
import { localStore } from '@/utils/localStorage';
import { LOCAL_CACHE_KEYS } from '@/config';

export default function Pricing() {
  const router = useRouter();
  const [packageList, setPackageList] = useState(null);
  const [monthSelected, setMonthSelected] = useState(null);
  const [roleList, setRoleList] = useState(null);
  const [freeTrial, setFreeTrial] = useState(null);
  const [openNotification, contextHolder] = useNotification();

  // package 1m, 3m, 6m, 12m
  useEffect(() => {
    getPackageList()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const monthSelected = res.payload[0];
          if (monthSelected) {
            setMonthSelected(monthSelected);
          }
          setPackageList(res.payload);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  // get role list
  useEffect(() => {
    getRoleList()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setRoleList(res.payload.filter((p) => p.type !== 'FREE_TRIAL'));
          const freeTrial = res.payload.find((p) => p.type === 'FREE_TRIAL');
          if (freeTrial) {
            setFreeTrial(freeTrial);
          }
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  const handleChangePackage = (monthSelected) => {
    setMonthSelected(monthSelected);
  };

  const handleUpgradePackage = (roleId) => {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (token) {
      router.push({
        pathname: '/pricing/payment',
        query: { role_id: roleId, package_id: monthSelected.id },
      });
    } else {
      router.push('/login');
    }
  };

  const handleFreeTrial = () => {
    const token = localStore.get(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (token) {
      const data = {
        role_id: freeTrial.id,
      };
      postUpgradeTrial(data)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            openNotification({
              type: NOTIFICATION_TYPE.SUCCESS,
              message: '',
              description: `${res.message}`,
            });
            router.push({
              pathname: '/profile',
              query: {
                tab: 2,
              },
            });
          }
        })
        .catch((err) => {
          openNotification({
            type: NOTIFICATION_TYPE.ERROR,
            message: '',
            description: JSON.parse(err.message).message,
          });
        });
    } else {
      router.push('/login');
    }
  };

  const handleLaunchPackage = () => {
    router.push('/chart');
  };

  return (
    <div className={styled.page}>
      {contextHolder}
      <div className={styled.pricingPage}>
        {packageList && roleList && (
          <div className={`${styled.pricingContainer} cm-container-v2`}>
            <div className={styled.chooseYourPlan}>
              <ChooseYourPlan
                monthSelected={monthSelected}
                packageList={packageList}
                handleChangePackage={handleChangePackage}
              />
            </div>
            <div className={styled.cardPricing}>
              <CardPricing
                monthSelected={monthSelected}
                freeTrial={freeTrial}
                roleList={roleList}
                handleUpgradePackage={handleUpgradePackage}
                handleFreeTrial={handleFreeTrial}
                handleLaunchPackage={handleLaunchPackage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
