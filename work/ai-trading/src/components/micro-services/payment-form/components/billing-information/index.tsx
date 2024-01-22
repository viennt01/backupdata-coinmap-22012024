import styled from './index.module.scss';
import { Form, Input, Select } from 'antd';
import { COUNTRIES, COUNTRY_CODES } from '@/constants/form';
import { LockOutlined } from '@ant-design/icons';
import useI18n from '@/i18n/useI18N';

export default function BillingInformation() {
  const { translate: translatePayment } = useI18n('payment-form');
  const { translate: translateForm } = useI18n('form');

  return (
    <div>
      <h1 className={styled.header}>
        {translatePayment('billing_information')}
      </h1>
      <div className={styled.content}>
        <Form.Item name="email" label={translateForm('label.email')}>
          <Input
            disabled
            size="large"
            placeholder={translateForm('placeholder.email')}
            autoComplete="off"
            addonAfter={<LockOutlined />}
          />
        </Form.Item>
        <Form.Item name="first_name" label={translateForm('label.first_name')}>
          <Input
            size="large"
            placeholder={translateForm('placeholder.first_name')}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item name="last_name" label={translateForm('label.last_name')}>
          <Input
            size="large"
            placeholder={translateForm('placeholder.last_name')}
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          label={translateForm('label.phone')}
          style={{ marginBottom: 0 }}
        >
          <Form.Item
            name="phone_code"
            style={{ display: 'inline-block', width: 104 }}
          >
            <Select
              size="large"
              options={COUNTRY_CODES.map(({ dial_code, code }) => ({
                value: `${code}_${dial_code}`,
                label: dial_code,
              }))}
              showSearch
              placeholder="+84"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            style={{
              display: 'inline-block',
              width: 'calc(100% - 104px - 16px)',
              marginLeft: 16,
            }}
            rules={[
              {
                pattern: /^[0-9]{7,15}$/,
                message: translateForm('message_error_pattern.phone'),
              },
            ]}
          >
            <Input
              size="large"
              style={{
                width: '100%',
              }}
              placeholder={translateForm('placeholder.phone')}
            />
          </Form.Item>
        </Form.Item>
        <Form.Item name="country" label={translateForm('label.country')}>
          <Select
            size="large"
            options={COUNTRIES.map((c) => ({
              value: c,
              label: c,
            }))}
            allowClear
            showSearch
            placeholder={translateForm('placeholder.country')}
          ></Select>
        </Form.Item>
      </div>
    </div>
  );
}
