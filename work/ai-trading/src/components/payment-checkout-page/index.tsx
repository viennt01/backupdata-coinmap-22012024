import styled from './index.module.scss';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { getRole, getTransaction, getCurrencyList } from './fetcher';
import { ERROR_CODE } from '@/constants/error-code';
import { notification } from 'antd';
import { SUPPORT_EMAIL } from '@/constants/common';
import { AppContext } from '@/app-context';
import { Currency, Role, Transaction, TRANSACTION_STATUS } from './interface';
import ROUTERS from '@/constants/router';
import PaymentCheckout, {
  PaymentCheckoutProps,
} from '@/components/micro-services/payment-checkout';
import { getThemeForm } from '@/utils/theme';

const PaymentCheckoutPage = () => {
  const router = useRouter();
  const { merchantInfo, appTheme } = useContext(AppContext);
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
        name: roleRes.payload.name ?? '',
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
          form: getThemeForm(appTheme),
          colors: {
            ...appTheme.colors,
          },
        }}
        redirectPaths={{
          paymentSuccess: ROUTERS.MY_PLAN,
          market: ROUTERS.MARKETPLACE,
        }}
        getTransaction={getTransaction}
      />
    </div>
  );
};

export default PaymentCheckoutPage;
