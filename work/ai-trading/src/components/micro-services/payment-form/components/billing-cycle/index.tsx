import styled from './index.module.scss';
import {
  ConfigProvider,
  Form,
  FormInstance,
  Image,
  InputNumber,
  Radio,
  Select,
  Skeleton,
} from 'antd';
import { calculateAmount, calculateDiscountAmount } from '@/utils/payment';
import { formatNumber } from '@/utils/format-number';
import { FALLBACK_IMG } from '@/constants/common';
import { Role, Package, BalanceRange } from '../../interface';
import useI18n from '@/i18n/useI18N';
import { FormValues, ThemeColor, PaymentFormProps } from '../..';
import { useEffect, useMemo, useState } from 'react';
import { ERROR_CODE } from '@/constants/error-code';
import debounce from '@/utils/debounce';

interface BillingCycleProps {
  form: FormInstance<FormValues>;
  colors: ThemeColor;
  roleInfo?: Role;
  packageList: Package[];
  balanceRangeList: BalanceRange[];
  getBotPrice: PaymentFormProps['getBotPrice'];
}

export default function BillingCycle({
  form,
  colors,
  roleInfo,
  packageList,
  balanceRangeList,
  getBotPrice,
}: BillingCycleProps) {
  const { translate: translatePayment } = useI18n('payment-form');
  const { translate: translateForm } = useI18n('form');
  const [rolePrice, setRolePrice] = useState(0);

  const selectedPackageId = Form.useWatch('package_id', form);
  const selectedBalanceRangeId = Form.useWatch('balance_range_id', form);
  const balance = Form.useWatch('balance', form);

  const packageInfo = useMemo(
    () => packageList.find((item) => item.id === selectedPackageId),
    [packageList, selectedPackageId]
  );

  const balanceRangeInfo = useMemo(
    () => balanceRangeList.find((item) => item.id === selectedBalanceRangeId),
    [balanceRangeList, selectedBalanceRangeId]
  );

  const balanceRangeOptions = useMemo(
    () =>
      balanceRangeList.map((balanceRange) => ({
        label: `Balance: $${formatNumber(balanceRange.from)} - $${formatNumber(
          balanceRange.to ?? Infinity
        )}`,
        value: balanceRange.id,
      })),
    [balanceRangeList]
  );

  const updateBotPrice = useMemo(
    () =>
      debounce((signal: AbortSignal, balance: number, bot_id: string) => {
        getBotPrice({ balance, bot_id }, { signal })
          .then((res) => {
            if (res.error_code === ERROR_CODE.SUCCESS) {
              setRolePrice(res.payload.total_price);
            }
          })
          .catch((err) => {
            console.log('err', err);
          });
      }, 500),
    [getBotPrice]
  );

  useEffect(() => {
    const basePrice = Number(roleInfo?.price || 0);
    setRolePrice(basePrice);
  }, [roleInfo]);

  useEffect(() => {
    if (!roleInfo || !balanceRangeInfo || !balance) return;
    const controller = new AbortController();
    const signal = controller.signal;
    form.validateFields(['balance']).then(() => {
      updateBotPrice(signal, balance, roleInfo.id);
    });

    return () => controller.abort();
  }, [form, roleInfo, balanceRangeInfo, balance, updateBotPrice]);

  return (
    <div className={styled.container}>
      <div className={styled.product}>
        <h1 className={styled.header}>{translatePayment('order_summary')}</h1>
        <div className={styled.productTitle}>{translatePayment('product')}</div>
        <div className={styled.productImageName}>
          <Image
            className={styled.productImage}
            preview={false}
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
      <div className={styled.tradingFund}>
        <div className={styled.title}>{translatePayment('trading_fund')}</div>
        <div className={styled.description}>
          {translatePayment('trading_fund_desc')}
        </div>

        <ConfigProvider
          theme={{
            token: {
              colorPrimaryBg: colors.primary,
              colorBgContainer: colors.secondary_darken_2,
              colorTextPlaceholder: colors.secondary_lighten_1,
              colorTextHeading: colors.on_secondary_darken_1,
            },
          }}
        >
          <Form.Item
            name="balance_range_id"
            required={false}
            rules={[
              {
                required: true,
                message: translateForm('message_error_required.balance_range'),
              },
            ]}
          >
            <Select
              size="large"
              options={balanceRangeOptions}
              placeholder={translateForm('placeholder.balance_range')}
            />
          </Form.Item>
          <Form.Item
            name="balance"
            label={translateForm('label.balance')}
            required={false}
            labelAlign="left"
            rules={[
              {
                required: true,
                message: translateForm('message_error_required.balance'),
              },
              () => ({
                validator(_, value) {
                  if (
                    !value ||
                    (value >= (balanceRangeInfo?.from || -Infinity) &&
                      value <= (balanceRangeInfo?.to || Infinity))
                  ) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      translateForm(
                        'message_error_required.balance_out_of_range'
                      )
                    )
                  );
                },
              }),
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              size="large"
              prefix="$"
              min={balanceRangeInfo?.from}
              max={balanceRangeInfo?.to}
              precision={0}
              placeholder={translateForm('placeholder.balance')}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
            />
          </Form.Item>
        </ConfigProvider>
      </div>

      <div className={styled.horizontalDivider} />

      <div className={styled.billingCycle}>
        <div className={styled.billingCycleTitle}>
          {translatePayment('billing_cycle')}
        </div>
        <Form.Item
          className={styled.packageId}
          name="package_id"
          rules={[
            {
              required: true,
              message: translateForm('message_error_required.package'),
            },
          ]}
        >
          <Radio.Group className={styled.billingCycleGroup}>
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
                            rolePrice,
                            1,
                            packageItem.discount_rate,
                            packageItem.discount_amount
                          )}
                      </div>
                      <div className={styled.billingCycleItemMonth}>
                        /{packageItem.type}
                      </div>
                    </div>
                    <div className={styled.billingCycleItemDiscount}>
                      {Number(packageItem.discount_rate)
                        ? `${translatePayment('discount')} ${formatNumber(
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
          <div>{translatePayment('you_saved')}</div>
          <div className={styled.savedPrice}>
            <div className={styled.discount}>
              {packageInfo?.discount_rate
                ? `(${formatNumber(packageInfo.discount_rate * 100, 0)}%)`
                : ''}
            </div>
            <div className={styled.price}>
              {'$' +
                calculateDiscountAmount(
                  rolePrice,
                  packageInfo?.quantity ?? 0,
                  packageInfo?.discount_rate ?? 0,
                  packageInfo?.discount_amount ?? 0
                )}
            </div>
          </div>
        </div>
        <div className={styled.totalPrice}>
          <div className={styled.total}>{translatePayment('total')}</div>
          <div className={styled.price}>
            {'$' +
              calculateAmount(
                rolePrice,
                packageInfo?.quantity ?? 0,
                packageInfo?.discount_rate ?? 0,
                packageInfo?.discount_amount ?? 0
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
