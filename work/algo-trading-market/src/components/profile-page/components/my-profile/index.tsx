import style from './index.module.scss';
import { useContext, useEffect, useState } from 'react';
import {
  Form,
  Input,
  ConfigProvider,
  Typography,
  Radio,
  DatePicker,
  Select,
  Row,
  Col,
  notification,
} from 'antd';
import { COUNTRIES, COUNTRY_CODES, GENDER } from '@/constants/form';
import {
  updateUserProFile,
  getUserProfile,
} from '@/components/profile-page/fetcher';
import { ERROR_CODE } from '@/constants/error-code';
import { AppContext } from '@/app-context';
import dayjs, { Dayjs } from 'dayjs';
import CustomButton from '@/components/common/custom-button';
import { LockOutlined } from '@ant-design/icons';
import COLORS from '@/constants/color';
import { THEME_FORM } from '@/constants/theme';

const { Text } = Typography;

interface FormValues {
  old_password?: string;
  password?: string;
  repeatPassword?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  country?: string;
  year_of_birth?: Dayjs;
  phone_code?: string;
  phone?: string;
}

const initialValues = {
  first_name: '',
  last_name: '',
  gender: null,
  country: null,
  year_of_birth: null,
  phone_code: null,
  phone: '',
};

const MyProfile = () => {
  const [form] = Form.useForm();
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiNotification, contextHolder] = notification.useNotification();
  const { userInfo, setUserInfo } = useContext(AppContext);

  const fetchUserInfo = () => {
    setLoading(true);
    getUserProfile()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.setFieldsValue(res.payload);
          if (res.payload.year_of_birth) {
            form.setFieldValue(
              'year_of_birth',
              dayjs(res.payload.year_of_birth)
            );
          }
        }
      })
      .catch((err) => {
        console.log('ERROR', err);
      })
      .finally(() => setLoading(false));
  };

  const onSubmit = (formValues: FormValues) => {
    setLoading(true);
    const data = {
      ...formValues,
      year_of_birth: formValues['year_of_birth']?.format('YYYY'),
    };
    updateUserProFile(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          apiNotification.success({
            message: '',
            description: 'Update successfully',
          });
          setChangePassword(false);
          if (setUserInfo) setUserInfo({ ...userInfo, ...res.payload });
        }
      })
      .catch((err) => {
        apiNotification.error({
          message: '',
          description: JSON.parse(err.message).message,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleToggleChangePassword = () => {
    setChangePassword((prev) => !prev);
    form.setFieldValue('old_password', undefined);
    form.setFieldValue('password', undefined);
    form.setFieldValue('repeatPassword', undefined);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className={style.profileWrapper}>
      {contextHolder}
      <h1 className={style.title}>My Profile</h1>
      <ConfigProvider theme={THEME_FORM}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div>
            <h2 className={style.sectionTitle}>Account information</h2>
            <Row className={style.accountSection}>
              <Col span={24} xl={{ span: 16, offset: 4 }}>
                <Form.Item name="email" label="Email">
                  <Input
                    disabled
                    size="large"
                    placeholder="Enter email"
                    autoComplete="off"
                    addonAfter={<LockOutlined />}
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
                          message: 'Please input your password!',
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
                        placeholder="••••••••"
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="New Password"
                      rules={[
                        {
                          required: true,
                          message: 'Please input your password!',
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
                        placeholder="••••••••"
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
                          message: 'Please input your password!',
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
                        placeholder="••••••••"
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Text
                      onClick={handleToggleChangePassword}
                      style={{ color: COLORS.PRIMARY, cursor: 'pointer' }}
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
                          style={{ color: COLORS.PRIMARY, cursor: 'pointer' }}
                        >
                          Change password
                        </Text>
                      </Col>
                    </Row>
                  </div>
                )}
              </Col>
            </Row>
          </div>
          <div>
            <h2 className={style.sectionTitle}>Personal information</h2>
            <Row className={style.personalSection}>
              <Col span={24} xl={{ span: 16, offset: 4 }}>
                <Form.Item name="first_name" label="First name">
                  <Input
                    size="large"
                    placeholder="First name"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item name="last_name" label="Last name">
                  <Input
                    size="large"
                    placeholder="Last name"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item label="Gender" name="gender">
                  <Radio.Group size="large">
                    {GENDER.map((g) => (
                      <Radio key={g.value} value={g.value}>
                        {g.name}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item name="country" label="Country">
                  <Select
                    size="large"
                    options={COUNTRIES.map((c) => ({
                      value: c,
                      label: c,
                    }))}
                    allowClear
                    showSearch
                    placeholder="Select your country"
                  ></Select>
                </Form.Item>
                <Form.Item name="year_of_birth" label="Date of Birth">
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    placeholder="Choose your year of birth"
                    picker="year"
                  />
                </Form.Item>
                <Form.Item label="Phone" style={{ marginBottom: 0 }}>
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
                        message: 'Invalid phone',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      style={{
                        width: '100%',
                      }}
                      placeholder="Phone number"
                    />
                  </Form.Item>
                </Form.Item>

                <CustomButton
                  style={{ width: '100%', height: 56 }}
                  type="submit"
                  loading={loading}
                >
                  SAVE CHANGES
                </CustomButton>
              </Col>
            </Row>
          </div>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default MyProfile;
