import styled from './style.module.scss';
import OrderSummary from '@/components/Payment/OrderSummary';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { ERROR_CODE } from '@/fetcher/utils';
import {
  getRole,
  getBot,
  getTradingBot,
  getTransaction,
  getCurrencyList,
} from './fetcher';
import { SvgTimeout, SvgArrowRightLong } from '@/assets/images/svg/page';
import { ConfigProvider, Col, Row, Button } from 'antd';
import { PAYMENT_TYPES } from '@/constant/codeConstants';
import CustomButton from '@/components/Payment/CustomButton';
import { useSelector } from 'react-redux';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';

const PAGE_NAMES = {
  [PAYMENT_TYPES.PRICING]: 'Pricing & Packages',
  [PAYMENT_TYPES.SIGNAL_BOT]: 'Marketplace',
  [PAYMENT_TYPES.TRADING_BOT]: 'Marketplace',
};

const REDIRECT_PATHS = {
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

const PaymentTimeout = ({ paymentType }) => {
  const router = useRouter();
  const [roleInfo, setRoleInfo] = useState({});
  const [packageInfo, setPackageInfo] = useState({});
  const [currencyInfo, setCurrencyInfo] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({});
  const pageAbility = useAbility(PageAbilityContext);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);

  const canIChange = (featureId) =>
    merchantInfo.checkPermission &&
    pageAbility.can(PERMISSION_ACTIONS.UPDATE, featureId);

  /**
   * get role and package information
   * @returns {Promise<void>}
   */
  const initialData = async () => {
    try {
      const { transaction_id } = router.query;
      if (transaction_id) {
        // get role, package and transaction info
        const transactionRes = await getTransaction(transaction_id);
        if (transactionRes.error_code !== ERROR_CODE.SUCCESS) return;

        setTransactionInfo(transactionRes.payload);
        setPackageInfo(transactionRes.payload.items[0]);

        const [roleRes, currencyRes] = await Promise.all([
          apiGetters[paymentType].getRole(transactionRes.payload.items[0].id),
          getCurrencyList(),
        ]);

        if (
          roleRes.error_code !== ERROR_CODE.SUCCESS ||
          currencyRes.error_code !== ERROR_CODE.SUCCESS
        )
          return;

        setRoleInfo({
          ...roleRes.payload,
          name: roleRes.payload.role_name ?? roleRes.payload.name,
          type:
            paymentType === PAYMENT_TYPES.SIGNAL_BOT
              ? roleRes.payload.type
              : '',
        });

        const selectedCurrency = currencyRes.payload.find(
          (item) => item.currency === transactionRes.payload.currency
        );
        if (selectedCurrency) setCurrencyInfo(selectedCurrency);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initialData();
  }, []);

  const renderSupportInfo = () => {
    const email = canIChange(FEATURE_ID.SUPPORT_EMAIL)
      ? merchantInfo.profile.config.support?.email
      : 'support@coinmap.tech';

    return (
      <div className={styled.support}>
        <div>Customer support</div>
        {email && (
          <Button
            type="link"
            className={styled.anchorButton}
            href={'mailto:' + email}
          >
            {email}
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className={styled.page}>
      <div className={`${styled.container} cm-container-v2`}>
        <ConfigProvider
          theme={{
            token: {
              screenXL: 1170,
              screenXLMin: 1200,
            },
          }}
        >
          <Row gutter={[16, 48]}>
            <Col xl={{ span: 20, offset: 4 }}>
              <div className={styled.title}>Checkout</div>
            </Col>
          </Row>
          <Row gutter={[16, 48]}>
            <Col order={2} span={24} xl={{ span: 10, offset: 4, order: 1 }}>
              <div className={styled.leftContent}>
                <div className={styled.wrappedContent}>
                  <div className={styled.info}>This order has expired</div>
                  <div className={styled.timeoutWrapper}>
                    <SvgTimeout width={128} height={128} />
                    <div className={styled.redirect}>
                      <div>
                        Please go back to the {PAGE_NAMES[paymentType]} and make
                        a new one.
                      </div>
                      <CustomButton
                        className={styled.actionButton}
                        onClick={() => router.push(REDIRECT_PATHS[paymentType])}
                      >
                        TO THE {PAGE_NAMES[paymentType]} <SvgArrowRightLong />
                      </CustomButton>
                    </div>
                  </div>
                </div>
                {renderSupportInfo()}
              </div>
            </Col>
            <Col order={3} span={24} xl={{ span: 2, offset: 2, order: 2 }}>
              <div className={styled.verticalDivider} />
            </Col>
            <Col order={1} span={24} xl={{ span: 6, order: 3 }}>
              <div className={styled.rightContent}>
                <OrderSummary
                  roleInfo={roleInfo}
                  packageInfo={packageInfo}
                  currencyInfo={currencyInfo}
                  transactionInfo={transactionInfo}
                />
                {renderSupportInfo()}
              </div>
            </Col>
          </Row>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default PaymentTimeout;
