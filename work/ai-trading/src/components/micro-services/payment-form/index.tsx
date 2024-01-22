import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ConfigProvider, Form, Col, Row, Button, ThemeConfig } from 'antd';
import styled from './index.module.scss';
import { ERROR_CODE } from '@/constants/error-code';
import { calculateAmount } from '@/utils/payment';
import BillingInformation from './components/billing-information';
import PaymentMethod from './components/payment-method';
import BillingCycle from './components/billing-cycle';
import CustomButton from '@/components/common/custom-button';
import {
  CreateTransaction,
  Currency,
  Package,
  Role,
  BalanceRange,
  GetBotPrice,
  BotPrice,
} from './interface';
import { NotificationInstance } from 'antd/es/notification/interface';
import { ResponseWithPayload } from '@/fetcher';
import useI18n from '@/i18n/useI18N';
import { getBotPrice } from '@/components/payment-form-page/fetcher';
import Policy from './components/policy-modal';
import AppModal from '@/components/modal';

export interface ThemeColor {
  primary: string;
  secondary: string;
  secondary_lighten_1: string;
  secondary_lighten_2: string;
  secondary_darken_1: string;
  secondary_darken_2: string;
  on_primary: string;
  on_secondary: string;
  on_secondary_darken_1: string;
  on_secondary_darken_2: string;
  on_secondary_lighten_1: string;
  on_secondary_lighten_2: string;
  on_price: string;
}

export interface PaymentFormProps {
  roleInfo?: Role;
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
  balanceRangeList: BalanceRange[];
  apiNotification: NotificationInstance;
  paymentPolicy: {
    content: string;
  };
  theme: {
    form: ThemeConfig;
    colors: ThemeColor;
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
  getBotPrice: (
    data: GetBotPrice,
    options?: RequestInit
  ) => Promise<ResponseWithPayload<BotPrice>>;
}

export interface FormValues {
  package_id: string;
  balance_range_id: string;
  balance: number;
  buy_currency: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_code: string;
  phone: string;
  country: string;
}

const initialValues = {
  package_id: null,
  balance_range_id: null,
  balance: null,
  buy_currency: null,
  email: '',
  first_name: '',
  last_name: '',
  phone_code: null,
  phone: '',
  country: null,
};

const PaymentForm = ({
  roleInfo,
  billingInfo,
  currencyList,
  packageList,
  balanceRangeList,
  apiNotification,
  paymentPolicy,
  theme,
  redirectPaths,
  createTransaction,
}: PaymentFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [form] = Form.useForm<FormValues>();
  const { translate: translatePayment } = useI18n('payment-form');

  const handleCreateTransaction = async (formValues: FormValues) => {
    setLoading(true);

    const packageInfo = packageList.find(
      (item) => item.id === formValues.package_id
    );
    const balanceRangeInfo = balanceRangeList.find(
      (item) => item.id === formValues.balance_range_id
    );

    if (!roleInfo || !packageInfo || !balanceRangeInfo) return;

    const botPriceRes = await getBotPrice({
      balance: formValues.balance,
      bot_id: roleInfo.id,
    });
    const botPrice = botPriceRes.payload.total_price;

    const requestData: CreateTransaction = {
      payment_method: 'COIN_PAYMENT',
      items: [
        {
          id: roleInfo.id,
          quantity: packageInfo.quantity,
          type: packageInfo.type,
          category: roleInfo.category,
          balance: formValues.balance,
        },
      ],
      amount: calculateAmount(
        botPrice,
        packageInfo.quantity,
        packageInfo.discount_rate,
        packageInfo.discount_amount
      ).replaceAll(',', ''),
      currency: formValues.buy_currency,
    };

    createTransaction(requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          router.push({
            pathname: redirectPaths.getIt,
            query: {
              transaction_id: res.payload.transaction_id,
            },
          });
        }
      })
      .catch((err) => {
        apiNotification.error({
          message: '',
          description: JSON.parse(err.message).message,
        });
      })
      .finally(() => {
        setLoading(false);
        setOpenModalConfirm(false);
      });
  };

  const handleOpenPolicyModal = () => {
    setOpenModalConfirm(true);
  };

  useEffect(() => {
    if (billingInfo) {
      form.setFieldsValue({
        email: billingInfo.email,
        first_name: billingInfo.first_name,
        last_name: billingInfo.last_name,
        phone_code: billingInfo.phone_code,
        phone: billingInfo.phone,
        country: billingInfo.country,
      });
    }
  }, [form, billingInfo]);

  useEffect(() => {
    if (packageList.length > 0) {
      form.setFieldValue('package_id', packageList[packageList.length - 1].id);
    }
  }, [form, packageList]);

  useEffect(() => {
    if (balanceRangeList.length > 0) {
      form.setFieldValue('balance_range_id', balanceRangeList[0].id);
    }
  }, [form, balanceRangeList]);

  useEffect(() => {
    const element = document.getElementById('payment-form');
    if (!element) return;
    Object.keys(theme.colors).forEach((key) => {
      element.style.setProperty(
        `--${key}`,
        theme.colors[key as keyof (typeof theme)['colors']]
      );
    });
  }, [theme.colors]);

  const renderActionButtons = () => (
    <>
      <CustomButton className={styled.getItButton} type="submit">
        {translatePayment('get_it')}
      </CustomButton>
      <Button
        className={styled.cancelButton}
        type="text"
        onClick={() => router.push(redirectPaths.cancel)}
      >
        {translatePayment('cancel_order')}
      </Button>
    </>
  );

  const handleAcceptPolicy = () => {
    handleCreateTransaction(form.getFieldsValue());
  };

  return (
    <div id="payment-form" className={styled.wrapper}>
      <ConfigProvider theme={theme.form}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleOpenPolicyModal}
          initialValues={initialValues}
          autoComplete="off"
          scrollToFirstError
        >
          <Row gutter={[16, 48]}>
            <Col xl={{ span: 20, offset: 4 }}>
              <div className={styled.title}>{translatePayment('payment')}</div>
            </Col>
          </Row>
          <Row gutter={[16, 48]}>
            <Col order={2} span={24} xl={{ span: 10, offset: 4, order: 1 }}>
              <div className={styled.leftContent}>
                <BillingInformation />
                <PaymentMethod currencyList={currencyList} />
                {renderActionButtons()}
              </div>
            </Col>
            <Col order={3} span={24} xl={{ span: 2, offset: 2, order: 2 }}>
              <div className={styled.verticalDivider} />
            </Col>
            <Col order={1} span={24} xl={{ span: 6, order: 3 }}>
              <div className={styled.rightContent}>
                <BillingCycle
                  form={form}
                  colors={theme.colors}
                  roleInfo={roleInfo}
                  packageList={packageList}
                  balanceRangeList={balanceRangeList}
                  getBotPrice={getBotPrice}
                />
                {renderActionButtons()}
              </div>
            </Col>
          </Row>
        </Form>
      </ConfigProvider>

      <AppModal
        open={openModalConfirm}
        close={() => {
          setOpenModalConfirm(false);
        }}
      >
        <Policy
          handleAcceptPolicy={handleAcceptPolicy}
          loading={loading}
          paymentPolicy={paymentPolicy}
        />
      </AppModal>
    </div>
  );
};

export default PaymentForm;
