import Icons from '@/components/HomePage/components/Icons';
import { ERROR_CODE } from '@/fetcher/utils';

import { useRouter } from 'next/router';
import { useState } from 'react';
import { userResetPassword } from './fetcher';
import style from './index.module.scss';

import Link from 'next/link';
import { LockOutlined } from '@ant-design/icons';
import { Button, Form, Input, ConfigProvider, Typography } from 'antd';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

const { Text } = Typography;

const ResetPasswordSuccessfully = () => {
  const router = useRouter();
  return (
    <div className={style.passWordSuccess}>
      <div className={style.box}>
        <Icons name={Icons.names.check} />
        <h1>Successful</h1>
      </div>
      <p>You can now use your new password to log in to your account</p>
      <div>
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
            className="login-form-button"
            onClick={() => router.push('/login')}
          >
            LOGIN NOW
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
};
const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { token } = router.query;
  const [openNotification, contextHolder] = useNotification();

  const [reseted, setReseted] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    if (!token) {
      setLoading(false);
      return;
    }

    const input = {
      token: token.toString(),
      password: data.password,
    };
    return userResetPassword(input)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setReseted(true);
        }
      })
      .catch((err) => {
        openNotification({
          type: NOTIFICATION_TYPE.ERROR,
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
      <div className={style.box__3}>
        <div className={style.group}>
          <div className={style.wrapped}>
            {reseted ? (
              <ResetPasswordSuccessfully />
            ) : (
              <>
                <h1>Reset password</h1>
                <p>
                  Here you can set new password for signing in to Coinmap
                  platform.
                </p>
                <Form
                  wrapperCol={24}
                  name="normal_login"
                  layout="vertical"
                  initialValues={{ email: '', password: '', rememberMe: false }}
                  onFinish={onSubmit}
                  autoComplete="off"
                >
                  <Form.Item
                    name="password"
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
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                      autoComplete="off"
                    />
                  </Form.Item>
                  <Form.Item
                    name="repeatPassword"
                    label="Repeat password"
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
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Enter repeat password"
                      autoComplete="off"
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
                        SET NEW PASSWORD
                      </Button>
                    </ConfigProvider>
                  </Form.Item>

                  <Form.Item>
                    <div className={style.registerContainer}>
                      <Text className={style.registerContainer}>
                        <Link href="/login">
                          <a>Back to login</a>
                        </Link>
                      </Text>
                    </div>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
