import CardPricing from '../CardPricing';
import ChooseYourPlan from '../Pricing/components/ChooseYourPlan/ChooseYourPlan';
import { ERROR_CODE } from '@/fetcher/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import style from './PopupUpgradeYourPlan.module.scss';
import { getPackageList, getRoleList, postUpgradeTrial } from './fetcher';
import BlurModal from '@/components/BlurModal';
import { InfoCircleFilled } from '@ant-design/icons';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

export default function PopupUpgradeYourPlan({ show, setShow }) {
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
    router.push({
      pathname: '/pricing/payment',
      query: { role_id: roleId, package_id: monthSelected.id },
    });
  };

  const handleFreeTrial = () => {
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
  };

  const handleLaunchPackage = () => {
    handleClose();
    router.push('/chart');
  };

  const handleClose = () => {
    setShow(false);
  };
  return (
    <BlurModal open={show} onClose={handleClose}>
      {contextHolder}
      <div className={style.PopupUpgradeYourPlan}>
        <div
          className={`${style.PopupUpgradeYourPlanContainer} cm-container-v2`}
        >
          <div className={style.PopupUpgradeYourPlanTitle}>
            Upgrade your plan to use this function{' '}
            <InfoCircleFilled style={{ color: '#FFC657' }} />
          </div>
          <div className={style.PopupUpgradeYourPlanHeader}>
            <ChooseYourPlan
              monthSelected={monthSelected}
              packageList={packageList}
              handleChangePackage={handleChangePackage}
            />
          </div>
          <div className={style.PopupUpgradeYourPlanCardContainer}>
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
      </div>
    </BlurModal>
  );
}
