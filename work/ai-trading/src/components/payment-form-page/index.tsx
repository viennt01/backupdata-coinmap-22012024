import { useRouter } from 'next/router';
import { useEffect, useState, useContext, useMemo } from 'react';
import { notification } from 'antd';
import {
  createTransaction,
  getAdditionalList,
  getBalanceRange,
  getBotPrice,
  getPackageList,
  getRole,
  getUnitCurrency,
} from './fetcher';
import styled from './index.module.scss';
import { ERROR_CODE } from '@/constants/error-code';
import { AppContext } from '@/app-context';
import {
  Currency,
  Package,
  PackageLocale,
  Role,
  BalanceRange,
  AdditionalData,
} from './interface';
import ROUTERS from '@/constants/router';
import PaymentForm, {
  PaymentFormProps,
} from '@/components/micro-services/payment-form';
import { getThemeForm } from '@/utils/theme';
import useLocale from '@/hook/use-locale';

export default function PaymentFormPage() {
  const router = useRouter();
  const locale = useLocale();
  const { userInfo, appTheme } = useContext(AppContext);
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [roleInfo, setRoleInfo] = useState<Role>();
  const [packageLocales, setPackageLocales] = useState<PackageLocale[]>([]);
  const [balanceRangeList, setBalanceRangeList] = useState<BalanceRange[]>([]);
  const [apiNotification, contextHolder] = notification.useNotification();
  const [additionalDataList, setAdditionalDataList] = useState<
    AdditionalData[]
  >([]);

  const billingInfo = userInfo
    ? {
        email: userInfo.email,
        first_name: userInfo.first_name,
        last_name: userInfo.last_name,
        phone_code: userInfo.phone_code,
        phone: userInfo.phone,
        country: userInfo.country,
      }
    : undefined;

  const packageList = useMemo(() => {
    const packages: Package[] = [];
    packageLocales.forEach((item) => {
      const packageData = item?.data?.translation?.[locale];
      if (packageData) packages.push({ ...packageData, id: item.id });
    });
    return packages.sort((a, b) => Number(a.order) - Number(b.order));
  }, [packageLocales, locale]);

  const paymentPolicy = useMemo(() => {
    if (!additionalDataList[0]) {
      const dataPaymentPolicy = {
        content: '<></>',
      };
      return dataPaymentPolicy;
    }
    const dataPaymentPolicy = additionalDataList[0].data[locale].payment_policy;
    return dataPaymentPolicy;
  }, [additionalDataList, locale]);

  useEffect(() => {
    getUnitCurrency()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setCurrencyList(payload);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getPackageList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setPackageLocales(payload);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getRole(router.query.role_id as string)
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setRoleInfo({
            ...payload,
            name: payload.name ?? '',
            type: payload.type ?? '',
          });
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getBalanceRange()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setBalanceRangeList(
            payload.data.ranges.map((item, index) => ({
              ...item,
              id: index.toString(),
            }))
          );
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
    getAdditionalList()
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setAdditionalDataList(payload);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }, []);

  return (
    <div className={`${styled.page} container`}>
      {contextHolder}
      <PaymentForm
        roleInfo={roleInfo as PaymentFormProps['roleInfo']}
        billingInfo={billingInfo as PaymentFormProps['billingInfo']}
        currencyList={currencyList}
        packageList={packageList}
        balanceRangeList={balanceRangeList}
        apiNotification={apiNotification}
        paymentPolicy={paymentPolicy}
        theme={{
          form: getThemeForm(appTheme),
          colors: {
            ...appTheme.colors,
          },
        }}
        redirectPaths={{
          getIt: ROUTERS.CHECKOUT,
          cancel: ROUTERS.MARKETPLACE,
        }}
        createTransaction={createTransaction}
        getBotPrice={getBotPrice}
      />
    </div>
  );
}
