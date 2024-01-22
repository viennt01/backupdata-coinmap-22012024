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
import { getThemeForm } from '@/utils/theme';
import useI18n from '@/i18n/useI18N';

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
  phone_code: 'VN_+84',
  phone: '',
};

const MyProfile = () => {
  const [form] = Form.useForm();
  const [changePassword, setChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiNotification, contextHolder] = notification.useNotification();
  const { userInfo, setUserInfo, appTheme } = useContext(AppContext);
  const { translate: translateForm } = useI18n('form');
  const { translate: translateProfile } = useI18n('profile');

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
      <h1 className={style.title}>{translateProfile('profile')}</h1>
      <ConfigProvider theme={getThemeForm(appTheme)}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <div>
            <h2 className={style.sectionTitle}>
              {translateProfile('account_information')}
            </h2>
            <Row className={style.accountSection}>
              <Col span={24} xl={{ span: 16, offset: 4 }}>
                <Form.Item
                  name="email"
                  label={translateForm('label.email')}
                  rules={[
                    {
                      required: true,
                      message: translateForm('message_error_required.email'),
                    },
                  ]}
                >
                  <Input
                    disabled
                    size="large"
                    placeholder={translateForm('placeholder.email')}
                    autoComplete="off"
                    addonAfter={<LockOutlined />}
                  />
                </Form.Item>
                {changePassword ? (
                  <>
                    <Form.Item
                      name="old_password"
                      label={translateForm('label.password')}
                      rules={[
                        {
                          required: true,
                          message: translateForm(
                            'message_error_required.password'
                          ),
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                          message: translateForm(
                            'message_error_pattern.password'
                          ),
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        type="password"
                        placeholder={translateForm('placeholder.password')}
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label={translateForm('label.new_password')}
                      rules={[
                        {
                          required: true,
                          message: translateForm(
                            'message_error_required.password'
                          ),
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                          message: translateForm(
                            'message_error_pattern.password'
                          ),
                        },
                      ]}
                    >
                      <Input.Password
                        size="large"
                        type="password"
                        placeholder={translateForm('placeholder.password')}
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Form.Item
                      name="repeatPassword"
                      label={translateForm('label.repeat_password')}
                      validateFirst
                      rules={[
                        {
                          required: true,
                          message: translateForm(
                            'message_error_required.password'
                          ),
                        },
                        {
                          pattern:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                          message: translateForm(
                            'message_error_pattern.password'
                          ),
                        },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                translateForm(
                                  'message_error_validator.password'
                                )
                              )
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        size="large"
                        type="password"
                        placeholder={translateForm('placeholder.password')}
                        autoComplete="off"
                      />
                    </Form.Item>
                    <Text
                      onClick={handleToggleChangePassword}
                      style={{
                        color: appTheme.colors.primary,
                        cursor: 'pointer',
                      }}
                    >
                      {translateForm('button.cancle')}
                    </Text>
                  </>
                ) : (
                  <div>
                    <Row justify={'space-between'}>
                      <Col>
                        <label className={style.passwordLabel}>
                          {translateForm('label.password')}
                        </label>
                      </Col>
                      <Col>
                        <Text
                          onClick={handleToggleChangePassword}
                          style={{
                            color: appTheme.colors.primary,
                            cursor: 'pointer',
                          }}
                        >
                          {translateForm('label.change_password')}
                        </Text>
                      </Col>
                    </Row>
                  </div>
                )}
              </Col>
            </Row>
          </div>
          <div>
            <h2 className={style.sectionTitle}>
              {' '}
              {translateProfile('persional_information')}
            </h2>
            <Row className={style.personalSection}>
              <Col span={24} xl={{ span: 16, offset: 4 }}>
                <Form.Item
                  name="first_name"
                  label={translateForm('label.first_name')}
                  rules={[
                    {
                      required: true,
                      message: translateForm(
                        'message_error_required.first_name'
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={translateForm('placeholder.first_name')}
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  name="last_name"
                  label={translateForm('label.last_name')}
                  rules={[
                    {
                      required: true,
                      message: translateForm(
                        'message_error_required.last_name'
                      ),
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder={translateForm('placeholder.last_name')}
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: translateForm('message_error_required.gender'),
                    },
                  ]}
                  label={translateForm('label.gender')}
                  name="gender"
                >
                  <Radio.Group size="large">
                    {GENDER.map((g) => (
                      <Radio key={g.value} value={g.value}>
                        {translateForm(`label.${g.name}`)}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item
                  name="country"
                  label={translateForm('label.country')}
                  rules={[
                    {
                      required: true,
                      message: translateForm('message_error_required.country'),
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
                <Form.Item
                  name="year_of_birth"
                  label={translateForm('label.year_of_birth')}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    size="large"
                    placeholder={translateForm('placeholder.year_of_birth')}
                    picker="year"
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
                      placeholder={translateForm('placeholder.phone')}
                      style={{
                        width: '100%',
                      }}
                    />
                  </Form.Item>
                </Form.Item>

                <CustomButton
                  style={{ width: '100%', height: 56 }}
                  type="submit"
                  loading={loading}
                >
                  {translateForm('button.save')}
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
