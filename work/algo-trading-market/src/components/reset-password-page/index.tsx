import { ERROR_CODE } from '@/constants/error-code';
import { Input, ConfigProvider, Form, notification, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { resetPassword, ResetPasswordData } from './fetcher';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import ROUTERS from '@/constants/router';
import { THEME_FORM } from '@/constants/theme';
import { SvgCheckSuccess } from '@/assets/images/svg';

const { Title } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [apiNotification, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [hasSendRequest, setHasSendRequest] = useState(false);
  const { token } = router.query;

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
            <div className={style.headers}>
              <Title className={style.title}>Successful</Title>
              <SvgCheckSuccess className={style.iconSuccess} />
            </div>
            <p className={style.description}>
              You can now use your new password to log in to your ATM’s account.
            </p>

            <CustomButton
              className={style.actionButton}
              onClick={() => router.push(ROUTERS.LOGIN)}
            >
              LOG IN NOW
            </CustomButton>
          </>
        ) : (
          <>
            <Title className={style.title}>Reset password</Title>
            <p className={style.description}>Set your new password</p>
            <ConfigProvider theme={THEME_FORM}>
              <Form
                form={form}
                name="normal_login"
                layout="vertical"
                initialValues={{ password: '', repeatPassword: '' }}
                onFinish={onSubmit}
                autoComplete="off"
              >
                <Form.Item
                  name="password"
                  label="New password"
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
                  label="Repeat your new password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Repeat password',
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
                  <CustomButton
                    type="submit"
                    className={style.actionButton}
                    loading={loading}
                  >
                    RESET PASSWORD
                  </CustomButton>
                </Form.Item>
              </Form>
            </ConfigProvider>
          </>
        )}
      </div>
    </div>
  );
}
