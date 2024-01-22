import { ERROR_CODE } from '@/constants/error-code';
import {
  Input,
  Row,
  Col,
  ConfigProvider,
  Checkbox,
  Form,
  notification,
  Typography,
} from 'antd';
import { useContext, useEffect, useState } from 'react';
import { RegisterData, userRegister } from './fetcher';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import Link from 'next/link';
import ROUTERS from '@/constants/router';
import PdfViewer from '@/components/common/pdf-viewer';
import AppModal from '@/components/modal';
import { AppContext } from '@/app-context';
import { getThemeForm } from '@/utils/theme';
import useI18n from '@/i18n/useI18N';
import { useRouter } from 'next/router';

const { Title } = Typography;

export default function RegisterPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [apiNotification, contextHolder] = notification.useNotification();
  const [showPdfPolicy, setShowPdfPolicy] = useState(false);
  const { merchantInfo, appTheme } = useContext(AppContext);
  const { translate } = useI18n();
  const { translate: translateForm } = useI18n('form');
  const { translate: translateRegister } = useI18n('register');

  const onSubmit = (data: RegisterData) => {
    setLoading(true);
    const input: RegisterData = {
      email: data.email,
      password: data.password,
      first_name: '',
      last_name: '',
    };

    return userRegister(input)
      .then((res) => {
        console.log(res);

        if (res.error_code === ERROR_CODE.SUCCESS) {
          apiNotification.success({
            message: '',
            description:
              'Account created successfully. Please check your email to verify your account.',
          });
        }
      })
      .catch((err) => {
        apiNotification.error({
          message: '',
          description: JSON.parse(err.message).message,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (
      merchantInfo &&
      merchantInfo.config &&
      !merchantInfo.config.user_registration
    ) {
      router.replace('/');
    }
  }, [merchantInfo, router]);

  if (
    merchantInfo &&
    merchantInfo.config &&
    !merchantInfo.config.user_registration
  ) {
    return null;
  }

  return (
    <div className={style.container}>
      {contextHolder}
      <div className={style.formContainer}>
        <Title className={style.loginTxt}>{translateRegister('start')}</Title>
        <ConfigProvider theme={getThemeForm(appTheme)}>
          <Form
            form={form}
            name="normal_login"
            layout="vertical"
            initialValues={{
              email: '',
              password: '',
              repeatPassword: '',
              confirmRule: false,
            }}
            onFinish={onSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label={translateForm('label.email')}
              rules={[
                {
                  type: 'email',
                  message: translateForm('message_error_pattern.email'),
                },
                {
                  required: true,
                  message: translateForm('message_error_required.email'),
                },
              ]}
              required={false}
              hasFeedback
              style={{ marginBottom: 24 }}
            >
              <Input size="large" placeholder="Email" autoComplete="off" />
            </Form.Item>
            <Form.Item
              name="password"
              label={translateForm('label.password')}
              rules={[
                {
                  required: true,
                  message: translateForm('message_error_required.password'),
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                  message: translateForm('message_error_pattern.password'),
                },
              ]}
              required={false}
              style={{ marginBottom: 24 }}
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
              label={translateForm('label.repeat_password')}
              rules={[
                {
                  required: true,
                  message: translateForm(
                    'message_error_required.repeat_password'
                  ),
                },
                {
                  pattern:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                  message: translateForm('message_error_pattern.password'),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        translateForm('message_error_validator.password')
                      )
                    );
                  },
                }),
              ]}
              required={false}
              style={{ marginBottom: 24 }}
            >
              <Input.Password
                size="large"
                type="password"
                placeholder="••••••••"
                autoComplete="off"
              />
            </Form.Item>
            <Form.Item>
              <Row>
                <Col flex="1">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: appTheme.colors.secondary_lighten_1,
                        colorText: appTheme.colors.on_secondary_darken_2,
                      },
                    }}
                  >
                    <Form.Item
                      name="confirmRule"
                      required
                      rules={[
                        ({}) => ({
                          validator(_, value) {
                            if (value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                translateForm(
                                  'message_error_validator.confirm_rule'
                                )
                              )
                            );
                          },
                        }),
                      ]}
                      valuePropName="checked"
                    >
                      <Checkbox>
                        {translateRegister('accept_policy')}{' '}
                        <span
                          className={style.forgotPassword}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPdfPolicy(true);
                          }}
                        >
                          {translateRegister('policy')}
                        </span>
                      </Checkbox>
                    </Form.Item>
                  </ConfigProvider>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item>
              <CustomButton
                type="submit"
                className={style.loginFormButton}
                loading={loading}
              >
                {translate('signup')}
              </CustomButton>
            </Form.Item>
          </Form>
        </ConfigProvider>
        <div className={style.supportWrapper}>
          {translateRegister('have_account')}?{' '}
          <Link className={style.support} href={ROUTERS.LOGIN}>
            {translate('login')}
          </Link>
        </div>
      </div>

      <AppModal open={showPdfPolicy} close={() => setShowPdfPolicy(false)}>
        <PdfViewer url={merchantInfo?.config?.policy_file?.url} />
      </AppModal>
    </div>
  );
}
