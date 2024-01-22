import styled from './BillingCycle.module.scss';
import { Form, Image, Radio, Skeleton } from 'antd';
import PropTypes from 'prop-types';
import {
  formatNumber,
  calculateAmount,
  calculateDiscountAmount,
} from '@/utils/payment';
import { FALLBACK_IMG } from '@/constant/codeConstants';

export default function BillingCycle({
  roleInfo,
  selectedPackageId,
  packageList,
  handleChangePackage,
}) {
  const packageInfo =
    packageList.find((item) => item.id === selectedPackageId) ?? {};

  return (
    <div className={styled.container}>
      <div className={styled.product}>
        <h1 className={styled.header}>Order summary</h1>
        <div className={styled.productTitle}>Product</div>
        <div className={styled.productImageName}>
          <Image
            className={styled.productImage}
            preview={false}
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
      <div className={styled.billingCycle}>
        <div className={styled.billingCycleTitle}>Billing cycle</div>
        <Form.Item
          className={styled.packageId}
          name="package_id"
          rules={[{ required: true, message: 'Please select package' }]}
        >
          <Radio.Group
            className={styled.billingCycleGroup}
            onChange={handleChangePackage}
          >
            {packageList.map((packageItem) => (
              <Radio
                className={styled.billingCycleItem}
                value={packageItem.id}
                key={packageItem.id}
              >
                <div className={styled.billingCycleItemLabel}>
                  <div className={styled.billingCycleItemTime}>
                    {packageItem.name}
                  </div>
                  <div className={styled.billingCycleItemPriceWrapper}>
                    <div className={styled.billingCycleItemPriceMonth}>
                      <div className={styled.billingCycleItemPrice}>
                        {'$' +
                          calculateAmount(
                            roleInfo.price,
                            1,
                            packageItem.discount_rate,
                            packageItem.discount_amount
                          )}
                      </div>
                      <div className={styled.billingCycleItemMonth}>/MO</div>
                    </div>
                    <div className={styled.billingCycleItemDiscount}>
                      {packageItem.discount_rate
                        ? `Discount ${formatNumber(
                            packageItem.discount_rate * 100,
                            0
                          )}%`
                        : ''}
                    </div>
                  </div>
                </div>
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </div>
      <div className={styled.horizontalDivider} />
      <div className={styled.totalBill}>
        <div className={styled.totalBillTitle}>
          <div>You saved</div>
          <div className={styled.savedPrice}>
            <div className={styled.discount}>
              {packageInfo.discount_rate
                ? `(${formatNumber(packageInfo.discount_rate * 100, 0)}%)`
                : ''}
            </div>
            <div className={styled.price}>
              {'$' +
                calculateDiscountAmount(
                  roleInfo.price,
                  packageInfo.quantity,
                  packageInfo.discount_rate,
                  packageInfo.discount_amount
                )}
            </div>
          </div>
        </div>
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
}

BillingCycle.propTypes = {
  roleInfo: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    image_url: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.string,
  }).isRequired,
  selectedPackageId: PropTypes.string,
  packageList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      discount_rate: PropTypes.number.isRequired,
      discount_amount: PropTypes.number.isRequired,
    })
  ).isRequired,
  handleChangePackage: PropTypes.func.isRequired,
};
