import { useEffect } from 'react';

import {
  Form,
  Input,
  ConfigProvider,
  Button,
  Typography,
  Radio,
  DatePicker,
  Select,
  Row,
  Col,
} from 'antd';
import { COUNTRIES, COUNTRY_CODES, GENDER } from '../constants';
import style from '../style.module.scss';

const { Text } = Typography;

export default function MyProfile({
  userInfo,
  onSubmit,
  changePassword,
  setChangePassword,
  loading,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(userInfo);
  }, [userInfo, form]);

  const handleToggleChangePassword = () => {
    setChangePassword((prev) => !prev);
    form.setFieldValue('old_password', undefined);
    form.setFieldValue('password', undefined);
    form.setFieldValue('repeatPassword', undefined);
  };

  return (
    <>
      <h1>My profile</h1>
      <Form
        form={form}
        name="normal_login"
        layout="vertical"
        initialValues={userInfo}
        onFinish={onSubmit}
        autoComplete="off"
      >
        <div>
          <h2>Account information </h2>
          <div className={style.accountSection}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  required: true,
                  message: 'Please input your Email',
                },
              ]}
            >
              <Input
                disabled
                size="large"
                placeholder="Enter your Firstname"
                autoComplete="off"
              />
            </Form.Item>
            {changePassword ? (
              <>
                <Form.Item
                  name="old_password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                      message:
                        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="New Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                      message:
                        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
                    },
                  ]}
                >
                  <Input.Password
                    size="large"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  name="repeatPassword"
                  label="Repeat Password"
                  validateFirst
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                      message:
                        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            'The two passwords that you entered do not match!'
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    size="large"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                  />
                </Form.Item>
                <Text
                  onClick={handleToggleChangePassword}
                  style={{ color: '#31AFFE', cursor: 'pointer' }}
                >
                  Close
                </Text>
              </>
            ) : (
              <div>
                <Row justify={'space-between'}>
                  <Col>
                    <label>Password</label>
                  </Col>
                  <Col>
                    <Text
                      onClick={handleToggleChangePassword}
                      style={{ color: '#31AFFE', cursor: 'pointer' }}
                    >
                      Change password
                    </Text>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        </div>
        <div>
          <h2>Personal information </h2>
          <div className={style.personalSection}>
            <Form.Item
              name="first_name"
              label="First name"
              rules={[
                {
                  required: true,
                  message: 'Please input your Firstname',
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your Firstname"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              name="last_name"
              label="Last name"
              rules={[
                {
                  required: true,
                  message: 'Please input your Lastname',
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter your Lastname"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please check this checkbox',
                },
              ]}
              label="Gender"
              name="gender"
              valuePropName="checked"
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#B02BFE',
                  },
                }}
              >
                <Form.Item style={{ marginBottom: 0 }} name="gender">
                  <Radio.Group size="large">
                    {GENDER.map((g) => (
                      <Radio key={g.value} size="large" value={g.value}>
                        {g.name}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
              </ConfigProvider>
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[
                {
                  required: true,
                  message: 'Please input your country',
                },
              ]}
            >
              <Select
                size="large"
                options={COUNTRIES.map((c) => ({
                  value: c,
                  label: c,
                }))}
                allowClear
                showSearch
              ></Select>
            </Form.Item>
            <Form.Item name="year_of_birth" label="Date of birth">
              <DatePicker
                style={{ width: '100%' }}
                size="large"
                placeholder="Choose your year of birth"
                picker="year"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[
                {
                  required: true,
                  message: 'Please input your Phone',
                },
                {
                  pattern: /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/g,
                  message: 'Invalid phone',
                },
              ]}
            >
              <Input
                addonBefore={
                  <Form.Item name="phone_code" noStyle>
                    <Select
                      className="countryCode"
                      size="large"
                      style={{
                        width: 100,
                        backgroundColor: 'unset',
                      }}
                      options={COUNTRY_CODES.map(({ dial_code, code }) => ({
                        value: `${code}_${dial_code}`,
                        label: dial_code,
                      }))}
                      showSearch
                    />
                  </Form.Item>
                }
                size="large"
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#B02BFE',
                  },
                }}
              >
                <Button
                  block
                  size="large"
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  loading={loading}
                >
                  SAVE CHANGES
                </Button>
              </ConfigProvider>
            </Form.Item>
          </div>
        </div>
      </Form>
    </>
  );
}
