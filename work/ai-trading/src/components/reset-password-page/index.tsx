import { ERROR_CODE } from '@/constants/error-code';
import { Input, ConfigProvider, Form, notification, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { resetPassword, ResetPasswordData } from './fetcher';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import Link from 'next/link';
import ROUTERS from '@/constants/router';
import { AppContext } from '@/app-context';
import { getThemeForm } from '@/utils/theme';
import useI18n from '@/i18n/useI18N';

const { Title } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [apiNotification, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [hasSendRequest, setHasSendRequest] = useState(false);
  const { token } = router.query;
  const { appTheme } = useContext(AppContext);
  const { translate } = useI18n();
  const { translate: translateResetPassword } = useI18n('reset-password');

  const onSubmit = (data: ResetPasswordData) => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      return;
    }
    const requestData = {
      token: token.toString(),
      password: data.password,
    };
    resetPassword(requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setHasSendRequest(true);
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

  return (
    <div className={style.container}>
      {contextHolder}
      <div className={style.formContainer}>
        {hasSendRequest ? (
          <>
            <Title className={style.title}>
              {translateResetPassword('title-susses')}
            </Title>
            <p className={style.description}>
              {translateResetPassword('description-susses')}
            </p>

            <CustomButton
              className={style.actionButton}
              onClick={() => router.push(ROUTERS.LOGIN)}
            >
              {translateResetPassword('login-now')}
            </CustomButton>
          </>
        ) : (
          <>
            <Title className={style.title}>
              {translateResetPassword('title')}
            </Title>
            <p className={style.description}>
              {translateResetPassword('description')}
            </p>
            <ConfigProvider theme={getThemeForm(appTheme)}>
              <Form
                form={form}
                name="normal_login"
                layout="vertical"
                initialValues={{ email: '', password: '', rememberMe: false }}
                onFinish={onSubmit}
                autoComplete="off"
              >
                <Form.Item
                  name="password"
                  label={`${translateResetPassword(
                    'form-set-password.label-new-password'
                  )}`}
                  rules={[
                    {
                      required: true,
                      message: `${translateResetPassword(
                        'form-set-password.new-password-message-1'
                      )}`,
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                      message: `${translateResetPassword(
                        'form-set-password.new-password-message-2'
                      )}`,
                    },
                  ]}
                  required={false}
                  hasFeedback
                  style={{ marginBottom: 24 }}
                >
                  <Input
                    size="large"
                    type="password"
                    placeholder={`${translateResetPassword(
                      'form-set-password.placeholder-password'
                    )}`}
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  name="repeatPassword"
                  label={`${translateResetPassword(
                    'form-set-password.label-repeat-password'
                  )}`}
                  rules={[
                    {
                      required: true,
                      message: `${translateResetPassword(
                        'form-set-password.new-password-message-1'
                      )}`,
                    },
                    {
                      pattern:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*(),.~/?=|;:'"{}<>]{8,}/,
                      message: `${translateResetPassword(
                        'form-set-password.new-password-message-2'
                      )}`,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            `${translateResetPassword(
                              'form-set-password.errors-password'
                            )}`
                          )
                        );
                      },
                    }),
                  ]}
                  required={false}
                  hasFeedback
                  style={{ marginBottom: 24 }}
                >
                  <Input
                    size="large"
                    type="password"
                    placeholder={`${translateResetPassword(
                      'form-set-password.placeholder-password'
                    )}`}
                    autoComplete="off"
                  />
                </Form.Item>

                <Form.Item>
                  <CustomButton
                    type="submit"
                    className={style.actionButton}
                    loading={loading}
                  >
                    {translateResetPassword('button_request_password')}
                  </CustomButton>
                </Form.Item>
              </Form>
            </ConfigProvider>
            <div className={style.supportWrapper}>
              <Link className={style.support} href={ROUTERS.LOGIN}>
                {translate('back_to_login')}
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
