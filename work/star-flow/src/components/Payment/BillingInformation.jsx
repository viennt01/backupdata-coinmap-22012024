import styled from './BillingInformation.module.scss';
import { ConfigProvider, theme, Form, Input, Select } from 'antd';
import { COUNTRIES, COUNTRY_CODES } from '@/components/ProfilePage/constants';
import { CaretDownOutlined, LockFilled } from '@ant-design/icons';

export default function BillingInformation() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorText: '#FFFFFF',
          colorTextPlaceholder: '#494762',
          colorTextDisabled: '#616887',
          colorBgContainer: '#1D1C32',
          colorBgContainerDisabled: '#151424',
          colorBorder: 'transparent',
          colorBgElevated: '#1D1C32',
          colorPrimaryHover: '#8F9BCE',
          colorPrimary: '#31AFFE',
        },
      }}
    >
      <div className={styled.container}>
        <h1 className={styled.header}>Billing information</h1>
        <div className={styled.content}>
          <Form.Item
            className={styled.billingInfo}
            label="Email"
            name="email"
            required
            rules={[{ required: true, message: 'Please fill your email' }]}
          >
            <Input
              className={styled.inputField}
              size="large"
              suffix={<LockFilled />}
              placeholder="signup@email.com"
              disabled
            />
          </Form.Item>
          <Form.Item
            className={styled.billingInfo}
            label="First Name"
            name="first_name"
            required
            hasFeedback
            rules={[{ required: true, message: 'Please fill your first name' }]}
          >
            <Input
              className={styled.inputField}
              size="large"
              placeholder="First name"
            />
          </Form.Item>
          <Form.Item
            className={styled.billingInfo}
            label="Last Name"
            name="last_name"
            required
            hasFeedback
            rules={[{ required: true, message: 'Please fill your last name' }]}
          >
            <Input
              className={styled.inputField}
              size="large"
              placeholder="Last name"
            />
          </Form.Item>
          <Form.Item
            className={styled.billingInfo}
            style={{ margin: 0 }}
            label="Phone"
            required
          >
            <Form.Item
              className={styled.phoneCodeWrapper}
              name="phone_code"
              rules={[
                { required: true, message: 'Please fill your phone code' },
              ]}
            >
              <Select
                className={`${styled.selectField} ${styled.phoneCode}`}
                popupClassName={styled.selectFieldDropdown}
                size="large"
                suffixIcon={<CaretDownOutlined />}
                options={COUNTRY_CODES.map(({ dial_code, code }) => ({
                  value: `${code}_${dial_code}`,
                  label: dial_code,
                }))}
                showSearch
              />
            </Form.Item>
            <Form.Item
              className={styled.phoneWrapper}
              name="phone"
              hasFeedback
              rules={[
                { required: true, message: 'Please fill your phone number' },
                {
                  pattern: /^[0-9]{7,15}$/,
                  message: 'Invalid phone number',
                },
              ]}
            >
              <Input
                className={styled.inputField}
                size="large"
                placeholder="Phone number"
              />
            </Form.Item>
          </Form.Item>
          <Form.Item
            className={styled.billingInfo}
            label="Country"
            name="country"
            required
            rules={[{ required: true, message: 'Please fill your country' }]}
          >
            <Select
              className={styled.selectField}
              popupClassName={styled.selectFieldDropdown}
              size="large"
              suffixIcon={<CaretDownOutlined />}
              options={COUNTRIES.map((country) => ({
                value: country,
                label: country,
              }))}
              showSearch
              filterOption={(input, option) =>
                option.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        </div>
      </div>
    </ConfigProvider>
  );
}
