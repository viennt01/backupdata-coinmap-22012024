import { ERROR_CODE } from '@/fetcher/utils';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import BillingInformation from '@/components/Payment/BillingInformation';
import PaymentMethod from '@/components/Payment/PaymentMethod';
import BillingCycle from '@/components/Payment/BillingCycle';
import { ConfigProvider, Form, Col, Row, Button } from 'antd';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import {
  getPackage,
  getPackageList,
  getRole,
  getBot,
  getTradingBot,
  getUnitCurrency,
  createTransaction,
} from './fetcher';
import styled from './style.module.scss';
import { PAYMENT_TYPES } from '@/constant/codeConstants';
import { calculateAmount } from '@/utils/payment';
import CustomButton from '@/components/Payment/CustomButton';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

const initialValues = {
  package_id: null,
  buy_currency: null,
  email: null,
  first_name: null,
  last_name: null,
  phone_code: 'VN_+84',
  phone: null,
  country: 'Viet Nam',
};

const PARENT_PATHS = {
  [PAYMENT_TYPES.PRICING]: '/pricing',
  [PAYMENT_TYPES.SIGNAL_BOT]: '/marketplace',
  [PAYMENT_TYPES.TRADING_BOT]: '/marketplace',
};

const apiGetters = {
  [PAYMENT_TYPES.PRICING]: {
    getRole,
  },
  [PAYMENT_TYPES.SIGNAL_BOT]: {
    getRole: getBot,
  },
  [PAYMENT_TYPES.TRADING_BOT]: {
    getRole: getTradingBot,
  },
};

const getQueryCurrencyString = (paymentType) => {
  switch (paymentType) {
    case PAYMENT_TYPES.PRICING: {
      return '?all=false&category=PKG';
    }
    case PAYMENT_TYPES.TRADING_BOT: {
      return '?all=false&category=TBOT';
    }
    case PAYMENT_TYPES.SIGNAL_BOT: {
      return '?all=false&category=SBOT';
    }
  }
};

export default function PaymentForm({ paymentType }) {
  const router = useRouter();
  const { billingInfo } = useSelector((state) => state.userProfile || null);
  const [unitCurrency, setUnitCurrency] = useState([]);
  const [roleInfo, setRoleInfo] = useState({});
  const [packageList, setPackageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [openNotification, contextHolder] = useNotification();

  const selectedPackageId = Form.useWatch('package_id', form);

  useEffect(() => {
    const queryString = getQueryCurrencyString(paymentType);
    getUnitCurrency(queryString).then(({ error_code, payload }) => {
      if (error_code === ERROR_CODE.SUCCESS) {
        setUnitCurrency(payload);
      }
    });
    getPackageList().then(({ error_code, payload }) => {
      if (error_code === ERROR_CODE.SUCCESS) {
        setPackageList(payload);
        if (!router.query.package_id) {
          form.setFieldValue('package_id', payload[payload.length - 1].id);
        }
      }
    });
    apiGetters[paymentType]
      .getRole(router.query.role_id)
      .then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          setRoleInfo({
            ...payload,
            name: payload.name ?? payload.role_name,
            type: paymentType === PAYMENT_TYPES.SIGNAL_BOT ? payload.type : '',
          });
        }
      });
    if (router.query.package_id) {
      getPackage(router.query.package_id).then(({ error_code, payload }) => {
        if (error_code === ERROR_CODE.SUCCESS) {
          form.setFieldValue('package_id', payload.id);
        }
      });
    }
  }, []);

  useEffect(() => {
    Object.keys(billingInfo).forEach((key) =>
      form.setFieldValue(key, billingInfo[key])
    );
  }, [form, billingInfo]);

  const handleChangePackage = (e) => {
    const value = e.target.value;
    router.replace(
      {
        pathname: `${PARENT_PATHS[paymentType]}/payment`,
        query: {
          ...router.query,
          package_id: value,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCreateTransaction = (formValues) => {
    const packageInfo = packageList.find(
      (item) => item.id === formValues.package_id
    );
    if (!roleInfo.id || !packageInfo) return;

    const requestData = {
      payment_method: 'COIN_PAYMENT',
      items: [
        {
          id: roleInfo.id,
          quantity: packageInfo.quantity,
          type: packageInfo.type,
          category: roleInfo.category,
        },
      ],
      amount: calculateAmount(
        roleInfo.price,
        packageInfo.quantity,
        packageInfo.discount_rate,
        packageInfo.discount_amount
      ),
      currency: formValues.buy_currency,
    };

    setLoading(true);
    createTransaction(requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          router.push({
            pathname: `${PARENT_PATHS[paymentType]}/payment/checkout`,
            query: {
              paymentType,
              transaction_id: res.payload.transaction_id,
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderActionButtons = () => (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FE842B',
          colorBgContainerDisabled: '#C1C2C4',
          colorTextDisabled: '#8F8F8F',
          colorPrimaryHover: '#fe9041',
        },
      }}
    >
      <CustomButton
        className={styled.getItButton}
        htmlType="submit"
        disabled={loading}
        append={<SvgArrowRightLong />}
      >
        GET IT
      </CustomButton>
      <Button
        className={styled.cancelButton}
        type="text"
        onClick={() => router.push(PARENT_PATHS[paymentType])}
      >
        Cancel order
      </Button>
    </ConfigProvider>
  );

  return (
    <div className={styled.page}>
      {contextHolder}
      <div className={`${styled.container} cm-container-v2`}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateTransaction}
          initialValues={initialValues}
          autoComplete="off"
          scrollToFirstError
        >
          <ConfigProvider
            theme={{
              token: {
                screenXL: 1200,
                screenXLMin: 1200,
              },
            }}
          >
            <Row gutter={[16, 48]}>
              <Col xl={{ span: 20, offset: 4 }}>
                <div className={styled.title}>Payment</div>
              </Col>
            </Row>
            <Row gutter={[16, 48]}>
              <Col order={2} span={24} xl={{ span: 10, offset: 4, order: 1 }}>
                <div className={styled.leftContent}>
                  <BillingInformation />
                  <PaymentMethod paymentMethods={unitCurrency} />
                  {renderActionButtons()}
                </div>
              </Col>
              <Col order={3} span={24} xl={{ span: 2, offset: 2, order: 2 }}>
                <div className={styled.verticalDivider} />
              </Col>
              <Col order={1} span={24} xl={{ span: 6, order: 3 }}>
                <div className={styled.rightContent}>
                  <BillingCycle
                    roleInfo={roleInfo}
                    selectedPackageId={selectedPackageId}
                    packageList={packageList}
                    handleChangePackage={handleChangePackage}
                  />
                  {renderActionButtons()}
                </div>
              </Col>
            </Row>
          </ConfigProvider>
        </Form>
      </div>
    </div>
  );
}
