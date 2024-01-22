import styled from './index.module.scss';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
  ThemeConfig,
} from 'antd';
import { formatNumber } from '@/utils/format-number';
import { FALLBACK_IMG } from '@/constants/common';
import { CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import SvgTimeout from './assets/timeout.svg';
import AppModal from '@/components/modal';
import PdfViewer from '@/components/common/pdf-viewer';
import CustomButton from '@/components/common/custom-button';
import OrderSummary from './components/order-summary';
import { Currency, Role, Transaction, TRANSACTION_STATUS } from './interface';
import { NotificationInstance } from 'antd/es/notification/interface';
import { ResponseWithPayload } from '@/fetcher';
import useI18n from '@/i18n/useI18N';

export interface PaymentCheckoutProps {
  roleInfo?: Role;
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

const PaymentCheckout = ({
  roleInfo,
  currencyInfo,
  transactionInfo,
  merchantInfo,
  apiNotification,
  theme,
  redirectPaths,
  getTransaction,
}: PaymentCheckoutProps) => {
  const router = useRouter();
  const checkPaymentIntervalRef = useRef<NodeJS.Timer>();
  const [showPdfPolicy, setShowPdfPolicy] = useState(false);
  const [showCopyTooltip, setShowCopyTooltip] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [countdownEnd, setCountdownEnd] = useState(0);
  const { translate: translateCheckout } = useI18n('payment-checkout');

  const handleCopyWalletAddress = () => {
    navigator.clipboard.writeText(transactionInfo?.wallet_address ?? '');
    setShowCopyTooltip(true);
    setTimeout(() => setShowCopyTooltip(false), 3000);
  };

  const checkPaymentStatus = useCallback(
    async (transactionId?: string) => {
      if (!transactionId) return;
      const transactionDetailRes = await getTransaction(transactionId);
      if (
        transactionDetailRes.payload?.status === TRANSACTION_STATUS.COMPLETE
      ) {
        router.push(redirectPaths.paymentSuccess);
        apiNotification.success({
          message: '',
          description: 'Payment successful',
        });
      }
    },
    [getTransaction, router, apiNotification, redirectPaths]
  );

  const handleFinishCountdown = useCallback(async () => {
    await checkPaymentStatus(transactionInfo?.transaction_id);
    setShowTimeout(true);
  }, [checkPaymentStatus, transactionInfo]);

  useEffect(() => {
    if (!transactionInfo) return;

    // check payment status first time
    checkPaymentStatus(transactionInfo.transaction_id);

    // initial countdown
    const expiredDate = new Date(Number(transactionInfo.created_at));
    expiredDate.setSeconds(
      Number(transactionInfo.timeout) + expiredDate.getSeconds()
    );
    const distance = expiredDate.getTime() - new Date().getTime();
    if (distance <= 1000) {
      handleFinishCountdown();
    } else {
      setCountdownEnd(expiredDate.getTime());
    }

    // start checking payment status every 30s
    checkPaymentIntervalRef.current = setInterval(
      () => checkPaymentStatus(transactionInfo.transaction_id),
      5000
    );

    return () => {
      clearInterval(checkPaymentIntervalRef.current);
    };
  }, [transactionInfo, checkPaymentStatus, handleFinishCountdown]);

  useEffect(() => {
    const element = document.getElementById('payment-checkout');
    if (!element) return;
    Object.keys(theme.colors).forEach((key) => {
      element.style.setProperty(
        `--${key}`,
        theme.colors[key as keyof (typeof theme)['colors']]
      );
    });
  }, [theme.colors]);

  const renderSupportInfo = () => {
    const email = merchantInfo?.supportEmail ?? '';

    return (
      <div className={styled.support}>
        <div>{translateCheckout('customer_support')}</div>
        <Link className={styled.anchorButton} href={'mailto:' + email}>
          {email}
        </Link>
      </div>
    );
  };

  const renderPolicyButton = () => {
    return (
      <span
        className={styled.anchorButton}
        onClick={() => setShowPdfPolicy(true)}
      >
        {translateCheckout('policy.our_policy')}
      </span>
    );
  };

  const renderCheckoutContent = () => {
    return (
      <div className={styled.checkoutContent}>
        <div className={styled.guideMain}>
          {translateCheckout('guide_main')}
        </div>
        <div className={styled.guideSub}>
          <div>
            {translateCheckout('guide_sub_1')}{' '}
            <Statistic.Countdown
              className={styled.countDown}
              value={countdownEnd}
              format="HH : mm : ss"
              onFinish={handleFinishCountdown}
            />
          </div>
          <div>{translateCheckout('guide_sub_2')}</div>
        </div>
        <div className={styled.paymentInfoWrapper}>
          <Image
            preview={false}
            src={transactionInfo?.qrcode_url ?? ''}
            alt=""
            fallback={FALLBACK_IMG}
            placeholder={
              <Skeleton.Image className={styled.qrCodeSkeleton} active />
            }
          />
          <div className={styled.paymentInfo}>
            <div className={styled.guideline}>
              {translateCheckout('guide_qr_code')}
            </div>
            <Input
              className={styled.walletId}
              value={transactionInfo?.wallet_address ?? ''}
              disabled
              suffix={
                <Tooltip open={showCopyTooltip} title="Copied" placement="top">
                  <Button
                    disabled={
                      showCopyTooltip || !transactionInfo?.wallet_address
                    }
                    type="ghost"
                    size="small"
                    icon={
                      showCopyTooltip ? (
                        <CheckCircleOutlined className={styled.copyIcon} />
                      ) : (
                        <CopyOutlined />
                      )
                    }
                    onClick={handleCopyWalletAddress}
                  ></Button>
                </Tooltip>
              }
            />
            <div className={styled.amountInfo}>
              <div>{translateCheckout('total_payment')}:</div>
              <div className={styled.amountWrapper}>
                <Image
                  preview={false}
                  className={styled.currencyImage}
                  src={currencyInfo?.image_url ?? ''}
                  alt=""
                  fallback={FALLBACK_IMG}
                  placeholder={
                    <Skeleton.Image className={styled.currencyImage} active />
                  }
                />
                {'$' + formatNumber(Number(transactionInfo?.amount ?? 0), 2)}
              </div>
            </div>
          </div>
        </div>
        <Alert
          className={styled.warning}
          type="warning"
          showIcon
          message={translateCheckout('payment_note')}
        />
        <div className={styled.policy}>
          {translateCheckout('policy.agree_to')} {renderPolicyButton()}
          .
          <br />
          {translateCheckout('policy.according_to')}{' '}
          <Link
            href="https://www.coinpayments.net/help-terms"
            target="_blank"
            rel="noreferrer"
            className={styled.anchorButton}
          >
            {translateCheckout('policy.user_agreement')}
          </Link>{' '}
          {translateCheckout('policy.and')}{' '}
          <Link
            href="https://www.coinpayments.net/help-privacy"
            target="_blank"
            rel="noreferrer"
            className={styled.anchorButton}
          >
            {translateCheckout('policy.privacy_policy')}
          </Link>
          .
        </div>
        {renderSupportInfo()}
      </div>
    );
  };

  const renderTimeoutContent = () => {
    return (
      <div className={styled.timeoutContent}>
        <div className={styled.info}>{translateCheckout('timeout.title')}</div>
        <div className={styled.content}>
          <SvgTimeout width={128} height={128} />
          <div className={styled.redirect}>
            <div>{translateCheckout('timeout.description')}</div>
            <CustomButton
              className={styled.actionButton}
              onClick={() => router.push(redirectPaths.market)}
            >
              {translateCheckout('timeout.go_to_market')}
            </CustomButton>
          </div>
        </div>
        {renderSupportInfo()}
      </div>
    );
  };

  return (
    <div id="payment-checkout" className={styled.wrapper}>
      <ConfigProvider theme={theme.form}>
        <Row gutter={[16, 48]}>
          <Col xl={{ span: 20, offset: 4 }}>
            <div className={styled.title}>{translateCheckout('checkout')}</div>
          </Col>
        </Row>
        <Row gutter={[16, 48]}>
          <Col order={2} span={24} xl={{ span: 10, offset: 4, order: 1 }}>
            <div className={styled.leftContent}>
              {showTimeout ? renderTimeoutContent() : renderCheckoutContent()}
            </div>
          </Col>
          <Col order={3} span={24} xl={{ span: 2, offset: 2, order: 2 }}>
            <div className={styled.verticalDivider} />
          </Col>
          <Col order={1} span={24} xl={{ span: 6, order: 3 }}>
            <div className={styled.rightContent}>
              <OrderSummary
                roleInfo={roleInfo}
                currencyInfo={currencyInfo}
                transactionInfo={transactionInfo}
              />
              {renderSupportInfo()}
            </div>
          </Col>
        </Row>
      </ConfigProvider>

      <AppModal open={showPdfPolicy} close={() => setShowPdfPolicy(false)}>
        <PdfViewer url={merchantInfo?.policyUrl} />
      </AppModal>
    </div>
  );
};

export default PaymentCheckout;
