import styled from './index.module.scss';
import { useState, useEffect, useContext, ComponentType } from 'react';
import { useRouter } from 'next/router';
import { getRole, getTransaction, getCurrencyList } from './fetcher';
import { ERROR_CODE } from '@/constants/error-code';
import { ThemeConfig, notification } from 'antd';
import { SUPPORT_EMAIL } from '@/constants/common';
import { AppContext } from '@/app-context';
import { THEME_FORM } from '@/constants/theme';
import { Currency, Role, Transaction, TRANSACTION_STATUS } from './interface';
import { ResponseWithPayload } from '@/fetcher';
import { NotificationInstance } from 'antd/es/notification/interface';
import dynamic from 'next/dynamic';
import COLORS from '@/constants/color';
import ROUTERS from '@/constants/router';
import Loading from '@/components/loading';

interface PaymentCheckoutProps {
  roleInfo?: {
    id: string;
    type: string;
    category: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
  };
  currencyInfo?: Currency;
  transactionInfo?: Transaction;
  merchantInfo?: {
    supportEmail: string;
    policyUrl: string;
  };
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
      SUNSET_ORANGE: string;
      METALIC_GOLD_COLOR: string;
      ALGAE: string;
      SAFFRON_MANGO: string;
    };
  };
  redirectPaths: {
    paymentSuccess: string;
    market: string;
  };
  getTransaction: (
    transactionId: string
  ) => Promise<ResponseWithPayload<Transaction>>;
}

const PaymentCheckout: ComponentType<PaymentCheckoutProps> = dynamic(
  () => import('mainServices/payment-checkout'),
  {
    ssr: false,
    loading: () => (
      <div style={{ marginTop: 40 }}>
        <Loading />
      </div>
    ),
  }
);

const PaymentCheckoutPage = () => {
  const router = useRouter();
  const { merchantInfo } = useContext(AppContext);
  const [roleInfo, setRoleInfo] = useState<Role>();
  const [currencyInfo, setCurrencyInfo] = useState<Currency>();
  const [transactionInfo, setTransactionInfo] = useState<Transaction>();
  const [apiNotification, contextHolder] = notification.useNotification();

  const initialData = async () => {
    try {
      const { transaction_id } = router.query;
      if (!transaction_id) return;

      const transactionRes = await getTransaction(transaction_id as string);
      if (transactionRes.error_code !== ERROR_CODE.SUCCESS) return;

      if (transactionRes.payload.status === TRANSACTION_STATUS.COMPLETE) {
        router.push(ROUTERS.MY_PLAN);
        apiNotification.success({
          message: '',
          description: 'Payment successful',
        });
        return;
      }
      setTransactionInfo(transactionRes.payload);

      const [roleRes, currencyRes] = await Promise.all([
        getRole(transactionRes.payload.items[0].id),
        getCurrencyList(),
      ]);

      if (
        roleRes.error_code !== ERROR_CODE.SUCCESS ||
        currencyRes.error_code !== ERROR_CODE.SUCCESS
      )
        return;

      setRoleInfo({
        ...roleRes.payload,
        name: roleRes.payload.role_name ?? '',
        type: roleRes.payload.type ?? '',
      });

      const selectedCurrency = currencyRes.payload.find(
        (item) => item.currency === transactionRes.payload.currency
      );
      if (selectedCurrency) setCurrencyInfo(selectedCurrency);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initialData();
  }, []);

  return (
    <div className={`${styled.page} container`}>
      {contextHolder}
      <PaymentCheckout
        roleInfo={roleInfo as PaymentCheckoutProps['roleInfo']}
        currencyInfo={currencyInfo}
        transactionInfo={transactionInfo}
        merchantInfo={{
          supportEmail: merchantInfo?.config?.support?.email || SUPPORT_EMAIL,
          policyUrl: merchantInfo?.config?.policy_file?.url ?? '',
        }}
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
            SUNSET_ORANGE: COLORS.SUNSET_ORANGE,
            METALIC_GOLD_COLOR: COLORS.METALIC_GOLD_COLOR,
            ALGAE: COLORS.ALGAE,
            SAFFRON_MANGO: COLORS.SAFFRON_MANGO,
          },
        }}
        redirectPaths={{
          paymentSuccess: ROUTERS.MY_PLAN,
          market: ROUTERS.PRICING,
        }}
        getTransaction={getTransaction}
      />
    </div>
  );
};

export default PaymentCheckoutPage;
