import styled from './index.module.scss';
import { Image, Skeleton } from 'antd';
import { formatNumber } from '@/utils/format-number';
import { calculateAmount, calculateDiscountAmount } from '@/utils/payment';
import { FALLBACK_IMG } from '@/constants/common';
import { Role, Currency, Transaction } from '../../interface';
import useI18n from '@/i18n/useI18N';
import { useMemo } from 'react';

interface OrderSummaryProps {
  roleInfo?: Role;
  currencyInfo?: Currency;
  transactionInfo?: Transaction;
}

const OrderSummary = ({
  roleInfo,
  currencyInfo,
  transactionInfo,
}: OrderSummaryProps) => {
  const { translate: translateCheckout } = useI18n('payment-checkout');
  const packageInfo = useMemo(
    () => transactionInfo?.items[0],
    [transactionInfo]
  );

  const displayBillingCycle = (quantity: number, unit: string) => {
    return `${quantity} ${unit.toLowerCase()}`;
  };

  const displayPricePerMonth = (
    price: number,
    discount_rate: number,
    discount_amount: number,
    unit: string
  ) => {
    const pricePerMonth = calculateAmount(
      price,
      1,
      discount_rate,
      discount_amount
    );
    return `$${pricePerMonth} / ${unit.toUpperCase()}`;
  };

  return (
    <div className={styled.container}>
      <div className={styled.product}>
        <h1 className={styled.header}>
          {translateCheckout('order_summary.title')}
        </h1>
        <div className={styled.productTitle}>
          {translateCheckout('order_summary.product')}
        </div>
        <div className={styled.productImageName}>
          <Image
            preview={false}
            className={styled.productImage}
            src={roleInfo?.image_url ?? ''}
            alt=""
            fallback={FALLBACK_IMG}
            placeholder={
              <Skeleton.Image className={styled.productImage} active />
            }
          />
          <div>
            <div className={styled.productName}>{roleInfo?.name ?? ''}</div>
            {roleInfo?.type && (
              <div className={styled.productType}>{roleInfo.type}</div>
            )}
          </div>
        </div>
        <div className={styled.productDescription}>
          {roleInfo?.description ?? ''}
        </div>
      </div>
      <div className={styled.horizontalDivider} />
      <div className={styled.billDescriptions}>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>
            {translateCheckout('order_summary.payment_id')}
          </span>
          <span className={styled.descriptionValue}>
            {transactionInfo?.order_id ?? ''}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>
            {translateCheckout('order_summary.billing_cycle')}
          </span>
          <span className={styled.descriptionValue}>
            {displayBillingCycle(
              packageInfo?.quantity ?? 0,
              packageInfo?.type ?? ''
            )}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>
            {translateCheckout('order_summary.price')}
          </span>
          <span className={styled.descriptionValue}>
            {displayPricePerMonth(
              Number(packageInfo?.price ?? 0),
              packageInfo?.discount_rate ?? 0,
              packageInfo?.discount_amount ?? 0,
              packageInfo?.type ?? ''
            )}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>
            {translateCheckout('order_summary.payment_method')}
          </span>
          <span className={styled.descriptionValue}>
            <div className={styled.currencyWrapper}>
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
              {transactionInfo?.currency ?? ''}
            </div>
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>
            {translateCheckout('order_summary.discount')}
          </span>
          <span
            className={`${styled.descriptionValue} ${styled.discountColor}`}
          >
            {formatNumber((packageInfo?.discount_rate ?? 0) * 100, 0) + '%'}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>
            {translateCheckout('order_summary.you_saved')}
          </span>
          <span className={styled.descriptionValue}>
            {'$' +
              calculateDiscountAmount(
                packageInfo?.price ?? 0,
                packageInfo?.quantity ?? 0,
                packageInfo?.discount_rate ?? 0,
                packageInfo?.discount_amount ?? 0
              )}
          </span>
        </div>
      </div>
      <div className={styled.horizontalDivider} />
      <div className={styled.totalBill}>
        <div className={styled.totalPrice}>
          <div className={styled.total}>
            {translateCheckout('order_summary.total')}
          </div>
          <div className={styled.price}>
            {'$' +
              calculateAmount(
                packageInfo?.price ?? 0,
                packageInfo?.quantity ?? 0,
                packageInfo?.discount_rate ?? 0,
                packageInfo?.discount_amount ?? 0
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
