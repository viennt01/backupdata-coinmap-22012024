import styled from './index.module.scss';
import { Form, Radio, Alert } from 'antd';
import { Currency } from '../../interface';
import useI18n from '@/i18n/useI18N';

interface PaymentMethodProps {
  currencyList: Currency[];
}

export default function PaymentMethod({ currencyList }: PaymentMethodProps) {
  const { translate: translatePayment } = useI18n('payment-form');
  const { translate: translateForm } = useI18n('form');

  return (
    <div>
      <h1 className={styled.header}>{translatePayment('payment_method')}</h1>
      <div className={styled.content}>
        <Alert
          className={styled.warning}
          type="warning"
          showIcon
          message={translatePayment('payment_method_note')}
        />
        <Form.Item
          className={styled.buyCurrency}
          name="buy_currency"
          rules={[
            {
              required: true,
              message: translateForm('message_error_required.payment_method'),
            },
          ]}
        >
          <Radio.Group className={styled.groupSelect}>
            {currencyList.map((method) => {
              return (
                <Radio
                  className={styled.groupItem}
                  value={method.currency}
                  key={method.id}
                >
                  <div className={styled.info}>
                    <img width={32} height={32} src={method.image_url} alt="" />
                    <div className={styled.name}>{method.name}</div>
                  </div>
                  <div className={styled.network}>{method.currency}</div>
                </Radio>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </div>
    </div>
  );
}
