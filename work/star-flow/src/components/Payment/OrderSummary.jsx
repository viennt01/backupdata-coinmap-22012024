import styled from './OrderSummary.module.scss';
import { Image, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import {
  formatNumber,
  calculateAmount,
  calculateDiscountAmount,
} from '@/utils/payment';
import { FALLBACK_IMG } from '@/constant/codeConstants';

const displayBillingCycle = (quantity) => {
  const display = quantity + ' month';
  if (quantity > 1) return display + 's';
  return display;
};

const displayPricePerMonth = (price, discount_rate, discount_amount) => {
  const pricePerMonth = calculateAmount(
    price,
    1,
    discount_rate,
    discount_amount
  );
  return `$${pricePerMonth} / MO`;
};

const OrderSummary = ({
  roleInfo,
  packageInfo,
  currencyInfo,
  transactionInfo,
}) => {
  return (
    <div className={styled.container}>
      <div className={styled.product}>
        <h1 className={styled.header}>Order summary</h1>
        <div className={styled.productTitle}>Product</div>
        <div className={styled.productImageName}>
          <Image
            preview={false}
            className={styled.productImage}
            src={roleInfo.image_url ?? ''}
            alt=""
            fallback={FALLBACK_IMG}
            placeholder={
              <Skeleton.Image className={styled.productImage} active />
            }
          />
          <div>
            <div className={styled.productName}>{roleInfo.name}</div>
            {roleInfo.type && (
              <div className={styled.productType}>{roleInfo.type}</div>
            )}
          </div>
        </div>
        <div className={styled.productDescription}>{roleInfo.description}</div>
      </div>
      <div className={styled.horizontalDivider} />
      <div className={styled.billDescriptions}>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>Payment ID</span>
          <span className={styled.descriptionValue}>
            {transactionInfo.order_id}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>Billing cycle</span>
          <span className={styled.descriptionValue}>
            {displayBillingCycle(packageInfo.quantity)}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>Price</span>
          <span className={styled.descriptionValue}>
            {displayPricePerMonth(
              roleInfo.price,
              packageInfo.discount_rate,
              packageInfo.discount_amount
            )}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>Payment method</span>
          <span className={styled.descriptionValue}>
            <div className={styled.currencyWrapper}>
              <Image
                preview={false}
                className={styled.currencyImage}
                src={currencyInfo.image_url ?? ''}
                alt=""
                fallback={FALLBACK_IMG}
                placeholder={
                  <Skeleton.Image className={styled.currencyImage} active />
                }
              />
              {transactionInfo.currency}
            </div>
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>Discount</span>
          <span
            className={`${styled.descriptionValue} ${styled.discountColor}`}
          >
            {formatNumber(packageInfo.discount_rate * 100, 0) + '%'}
          </span>
        </div>
        <div className={styled.description}>
          <span className={styled.descriptionLabel}>You saved</span>
          <span className={styled.descriptionValue}>
            {'$' +
              calculateDiscountAmount(
                roleInfo.price,
                packageInfo.quantity,
                packageInfo.discount_rate,
                packageInfo.discount_amount
              )}
          </span>
        </div>
      </div>
      <div className={styled.horizontalDivider} />
      <div className={styled.totalBill}>
        <div className={styled.totalPrice}>
          <div className={styled.total}>Total</div>
          <div className={styled.price}>
            {'$' +
              calculateAmount(
                roleInfo.price,
                packageInfo.quantity,
                packageInfo.discount_rate,
                packageInfo.discount_amount
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

OrderSummary.propTypes = {
  roleInfo: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    image_url: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,
  packageInfo: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    discount_rate: PropTypes.number,
    discount_amount: PropTypes.number,
  }).isRequired,
  currencyInfo: PropTypes.shape({
    image_url: PropTypes.string,
  }).isRequired,
  transactionInfo: PropTypes.shape({
    order_id: PropTypes.string,
    currency: PropTypes.string,
  }).isRequired,
};
