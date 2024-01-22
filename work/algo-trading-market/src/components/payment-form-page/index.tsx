import { useRouter } from 'next/router';
import { useEffect, useState, useContext, ComponentType } from 'react';
import { ThemeConfig, notification } from 'antd';
import {
  createTransaction,
  getPackageList,
  getRole,
  getUnitCurrency,
} from './fetcher';
import styled from './index.module.scss';
import { ERROR_CODE } from '@/constants/error-code';
import { THEME_FORM } from '@/constants/theme';
import { AppContext } from '@/app-context';
import { CreateTransaction, Currency, Package, Role } from './interface';
import dynamic from 'next/dynamic';
import { NotificationInstance } from 'antd/es/notification/interface';
import COLORS from '@/constants/color';
import { ResponseWithPayload } from '@/fetcher';
import ROUTERS from '@/constants/router';
import Loading from '@/components/loading';

interface PaymentFormProps {
  roleInfo?: {
    id: string;
    type: string;
    category: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
  };
  billingInfo?: {
    email: string;
    first_name: string;
    last_name: string;
    phone_code: string;
    phone: string;
    country: string;
  };
  currencyList: Currency[];
  packageList: Package[];
  apiNotification: NotificationInstance;
  theme: {
    form: ThemeConfig;
    colors: {
      PRIMARY: string;
      BG_SECONDARY: string;
      WHITE: string;
      MUTED: string;
      BLACK_PEARL: string;
      JET_GREY: string;
      JAGUAR: string;
      MIRAGE: string;
      SUNSET_ORANGE: string;
      METALIC_GOLD_COLOR: string;
      ALGAE: string;
      SAFFRON_MANGO: string;
    };
  };
  redirectPaths: {
    getIt: string;
    cancel: string;
  };
  createTransaction: (data: CreateTransaction) => Promise<
    ResponseWithPayload<{
      transaction_id: string;
    }>
  >;
}

const PaymentForm: ComponentType<PaymentFormProps> = dynamic(
  () => import('mainServices/payment-form'),
  {
    ssr: false,
    loading: () => (
      <div style={{ marginTop: 40 }}>
        <Loading />
      </div>
    ),
  }
);

export default function PaymentFormPage() {
  const router = useRouter();
  const { userInfo } = useContext(AppContext);
  const [currencyList, setCurrencyList] = useState<Currency[]>([]);
  const [roleInfo, setRoleInfo] = useState<Role>();
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [apiNotification, contextHolder] = notification.useNotification();

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

  useEffect(() => {
    getUnitCurrency().then(({ error_code, payload }) => {
      if (error_code === ERROR_CODE.SUCCESS) {
        setCurrencyList(payload);
      }
    });
    getPackageList().then(({ error_code, payload }) => {
      if (error_code === ERROR_CODE.SUCCESS) {
        setPackageList(payload);
      }
    });
    getRole(router.query.role_id as string).then(({ error_code, payload }) => {
      if (error_code === ERROR_CODE.SUCCESS) {
        setRoleInfo({
          ...payload,
          name: payload.role_name ?? '',
          type: payload.type ?? '',
        });
      }
    });
  }, []);

  return (
    <div className={`${styled.page} container`}>
      {contextHolder}
      <PaymentForm
        roleInfo={roleInfo as PaymentFormProps['roleInfo']}
        billingInfo={billingInfo}
        currencyList={currencyList}
        packageList={packageList}
        apiNotification={apiNotification}
        theme={{
          form: THEME_FORM,
          colors: {
            PRIMARY: COLORS.PRIMARY,
            BG_SECONDARY: COLORS.BG_SECONDARY,
            WHITE: COLORS.WHITE,
            MUTED: COLORS.MUTED,
            BLACK_PEARL: COLORS.BLACK_PEARL,
            JET_GREY: COLORS.JET_GREY,
            JAGUAR: COLORS.JAGUAR,
            MIRAGE: COLORS.MIRAGE,
            SUNSET_ORANGE: COLORS.SUNSET_ORANGE,
            METALIC_GOLD_COLOR: COLORS.METALIC_GOLD_COLOR,
            ALGAE: COLORS.ALGAE,
            SAFFRON_MANGO: COLORS.SAFFRON_MANGO,
          },
        }}
        redirectPaths={{
          getIt: ROUTERS.PRICING_CHECKOUT,
          cancel: ROUTERS.PRICING,
        }}
        createTransaction={createTransaction}
      />
    </div>
  );
}
