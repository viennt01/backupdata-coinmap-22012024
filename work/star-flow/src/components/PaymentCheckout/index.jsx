import styled from './style.module.scss';
import { SvgCopy } from '@/assets/images/svg';
import OrderSummary from '@/components/Payment/OrderSummary';
import { useState, useEffect, useRef } from 'react';
import PolicyDialog from '@/components/PolicyDialog';
import { useRouter } from 'next/router';
import {
  getRole,
  getBot,
  getTradingBot,
  getTransaction,
  getCurrencyList,
} from './fetcher';
import { ERROR_CODE } from '@/fetcher/utils';
import { TRANSACTION_STATUS } from '@/constant/codeConstants';
import {
  ConfigProvider,
  Col,
  Row,
  Button,
  Skeleton,
  Image,
  Input,
  Tooltip,
  Alert,
  Statistic,
} from 'antd';
import { PAYMENT_TYPES, FALLBACK_IMG } from '@/constant/codeConstants';
import { formatNumber } from '@/utils/payment';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';
import { useSelector } from 'react-redux';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';
import BlurModal from '@/components/BlurModal';
import PdfViewer from '@/components/PdfViewer';

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

const PaymentCheckout = ({ paymentType }) => {
  const router = useRouter();
  const walletIdRef = useRef(null);
  const checkPaymentIntervalRef = useRef(null);

  const [isShowPolicy, setIsShowPolicy] = useState(false);
  const [showPdfPolicy, setShowPdfPolicy] = useState(false);
  const closePolicyDialog = () => setIsShowPolicy(false);
  const openPolicyDialog = () => setIsShowPolicy(true);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [countdownEnd, setCountdownEnd] = useState(0);

  const [roleInfo, setRoleInfo] = useState({});
  const [packageInfo, setPackageInfo] = useState({});
  const [currencyInfo, setCurrencyInfo] = useState({});
  const [transactionInfo, setTransactionInfo] = useState({});
  const [openNotification, contextHolder] = useNotification();
  const pageAbility = useAbility(PageAbilityContext);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);

  const canIChange = (featureId) =>
    merchantInfo.checkPermission &&
    pageAbility.can(PERMISSION_ACTIONS.UPDATE, featureId);

  /**
   * copy wallet address to clipboard
   * @returns void
   */
  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(transactionInfo.wallet_address ?? '');
    walletIdRef.current.select();
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 1000);
  };

  /**
   * check payment status
   * @param {string} transactionId transaction id
   * @returns void
   */
  const checkPaymentStatus = async (transactionId) => {
    const transactionDetailRes = await getTransaction(transactionId);
    if (transactionDetailRes.payload?.status === TRANSACTION_STATUS.COMPLETE) {
      router.push('/profile?tab=2');
      openNotification({
        type: NOTIFICATION_TYPE.SUCCESS,
        message: '',
        description: 'Payment successful',
      });
    }
  };

  /**
   * check payment status when finish countdown
   * @returns void
   */
  const handleFinishCountdown = async () => {
    await checkPaymentStatus(transactionInfo.transaction_id);
    router.push({
      pathname: `${PARENT_PATHS[paymentType]}/payment/timeout`,
      query: { transaction_id: transactionInfo.transaction_id },
    });
  };

  /**
   * setup countdown based on timeout of transaction
   * @param {string} createdAt transaction created time
   * @param {string} timeout transaction timeout
   * @returns void
   */
  const initCountdown = (createdAt, timeout) => {
    const expiredDate = new Date(Number(createdAt));
    expiredDate.setSeconds(Number(timeout) + expiredDate.getSeconds());
    const distance = expiredDate.getTime() - new Date().getTime();
    distance <= 1000
      ? handleFinishCountdown()
      : setCountdownEnd(expiredDate.getTime());
  };

  /**
   * get role and package information
   * @returns {Promise<void>}
   */
  const initialData = async () => {
    try {
      const { transaction_id } = router.query;
      if (!transaction_id) return;

      const transactionRes = await getTransaction(transaction_id);
      if (transactionRes.error_code !== ERROR_CODE.SUCCESS) return;

      if (transactionRes.payload.status === TRANSACTION_STATUS.COMPLETE) {
        router.push('/profile?tab=2');
        openNotification({
          type: NOTIFICATION_TYPE.SUCCESS,
          message: '',
          description: 'Payment successful',
        });
        return;
      }
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
          paymentType === PAYMENT_TYPES.SIGNAL_BOT ? roleRes.payload.type : '',
      });

      const selectedCurrency = currencyRes.payload.find(
        (item) => item.currency === transactionRes.payload.currency
      );
      if (selectedCurrency) setCurrencyInfo(selectedCurrency);

      // initial countdown
      initCountdown(
        transactionRes.payload.created_at,
        transactionRes.payload.timeout
      );

      // start checking payment status every 30s
      checkPaymentIntervalRef.current = setInterval(
        () => checkPaymentStatus(transaction_id),
        30000
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initialData();

    return () => {
      clearInterval(checkPaymentIntervalRef.current);
    };
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

  const renderPolicyButton = () => {
    return canIChange(FEATURE_ID.MODAL_POLICY) ? (
      <Button
        type="link"
        className={styled.anchorButton}
        onClick={() => setShowPdfPolicy(true)}
      >
        Our Policy
      </Button>
    ) : (
      <Button
        type="link"
        className={styled.anchorButton}
        onClick={openPolicyDialog}
      >
        {`Coinmap's policy`}
      </Button>
    );
  };

  return (
    <div className={styled.page}>
      {contextHolder}
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
                <div className={styled.guideMain}>
                  Please transfer to the following address to complete the
                  payment
                </div>
                <div className={styled.guideSub}>
                  <div>
                    Please pay this invoice after{' '}
                    <Statistic.Countdown
                      className={styled.countDown}
                      value={countdownEnd}
                      format="HH : mm : ss"
                      onFinish={handleFinishCountdown}
                    />
                  </div>
                  <div>
                    After the above time, if the payment is not complete, the
                    invoice will be canceled automatically.
                  </div>
                </div>
                <div className={styled.paymentInfoWrapper}>
                  <Image
                    preview={false}
                    src={transactionInfo.qrcode_url ?? ''}
                    alt=""
                    fallback={FALLBACK_IMG}
                    placeholder={
                      <Skeleton.Image
                        className={styled.qrCodeSkeleton}
                        active
                      />
                    }
                  />
                  <div className={styled.paymentInfo}>
                    <div className={styled.guideline}>
                      Scan this QR code or copy and paste the payment details
                      into your wallet
                    </div>
                    <Input
                      ref={walletIdRef}
                      className={styled.walletId}
                      value={transactionInfo.wallet_address ?? ''}
                      readOnly
                      suffix={
                        <Tooltip
                          open={showCopyTooltip}
                          title="Copied"
                          placement="bottom"
                        >
                          <SvgCopy
                            className={styled.copyIcon}
                            onClick={handleCopyWalletAddress}
                          />
                        </Tooltip>
                      }
                    />
                    <div className={styled.amountInfo}>
                      <div>Total payment:</div>
                      <div className={styled.amountWrapper}>
                        <Image
                          preview={false}
                          className={styled.currencyImage}
                          src={currencyInfo.image_url ?? ''}
                          alt=""
                          fallback={FALLBACK_IMG}
                          placeholder={
                            <Skeleton.Image
                              className={styled.currencyImage}
                              active
                            />
                          }
                        />
                        {'$' + formatNumber(transactionInfo.amount)}
                      </div>
                    </div>
                  </div>
                </div>
                <Alert
                  className={styled.warning}
                  type="warning"
                  showIcon
                  message="Make sure to send enough to cover any coin transaction fees!"
                />
                <div className={styled.policy}>
                  By processing payment, you agree to {renderPolicyButton()}
                  .
                  <br />
                  Payment will be processd separately by Coinpayments according
                  to{' '}
                  <Button
                    type="link"
                    href="https://www.coinpayments.net/help-terms"
                    target="_blank"
                    rel="noreferrer"
                    className={styled.anchorButton}
                  >
                    Coinpayments User Agreement
                  </Button>{' '}
                  and{' '}
                  <Button
                    type="link"
                    href="https://www.coinpayments.net/help-privacy"
                    target="_blank"
                    rel="noreferrer"
                    className={styled.anchorButton}
                  >
                    Privacy Policy
                  </Button>
                  .
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

        <PolicyDialog show={isShowPolicy} handleClose={closePolicyDialog} />

        <BlurModal open={showPdfPolicy} onClose={() => setShowPdfPolicy(false)}>
          <PdfViewer url={merchantInfo.profile.config.policy_file?.url} />
        </BlurModal>
      </div>
    </div>
  );
};

export default PaymentCheckout;
