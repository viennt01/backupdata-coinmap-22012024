import React, { useEffect, useState } from 'react';
import Form from '../components/create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/broker/components/create-form';
import { Update, getBrokerSettings, updateById } from '../fetcher';
import { useRouter } from 'next/router';
import {
  Broker,
  BrokerSetting,
} from '@/components/affiliate/merchants/interface';
import { ROUTERS } from '@/constants/router';

const BrokerCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [brokerSetting, setBrokerSetting] = useState<BrokerSetting>();

  const fetchData = () => {
    getBrokerSettings()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS && res.payload[0]) {
          setBrokerSetting(res.payload[0]);
        }
      })
      .catch((e: Error) => {
        console.log(e);
      });
  };

  const handleSubmit = (formValues: FormValues) => {
    const broker: Broker = {
      code: formValues.code,
      name: formValues.name,
      required_profile: formValues.required_profile,
      check_referral_broker: formValues.check_referral_broker,
      broker_timezone: formValues.broker_timezone,
      broker_dst_switch_timezone: formValues.broker_dst_switch_timezone,
      referral_setting: formValues.referral_setting,
      servers: formValues.servers,
    };
    if (brokerSetting?.id) {
      const value = JSON.parse(brokerSetting.value);
      const _requestData: Update = {
        id: brokerSetting.id,
        value: JSON.stringify({
          ...value,
          [formValues.code]: broker,
        }),
      };
      updateById(_requestData, id as string)
        .then((res) => {
          if (res.error_code === ERROR_CODE.SUCCESS) {
            successToast('Update successfully');
          }
        })
        .catch((e: Error) => {
          errorToast(JSON.parse(e.message)?.message || 'Failed to update data');
          console.log(e);
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageTitle title="Edit broker" previousPath={ROUTERS.AFFILIATE_BROKER} />
      <Form handleSubmit={handleSubmit} create={false} />
    </>
  );
};

export default BrokerCreatePage;
