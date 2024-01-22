import Head from 'next/head';
import { ERROR_CODE } from '@/fetcher/utils';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { userForgetPassword } from './fetcher';
import style from './index.module.scss';

import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, ConfigProvider, Typography } from 'antd';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

const { Text } = Typography;

const CheckEmail = () => {
  const router = useRouter();
  return (
    <div className={style.emailGroup}>
      <h1>Check your email</h1>
      <p>We have sent a password recover link and instructions to your email</p>

      <div className={style.btn__1}>
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
            onClick={() => router.push('/login')}
          >
            BACK TO LOGIN
          </Button>
        </ConfigProvider>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openNotification, contextHolder] = useNotification();

  const onSubmit = (data) => {
    setLoading(true);
    const input = {
      email: data.email,
    };
    return userForgetPassword(input)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setCheckedEmail(true);
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
      <Head>
        <title>Forgot password</title>
      </Head>
      {contextHolder}
      <div className={style.box__3}>
        <div className={style.group}>
          <div className={style.wrapped}>
            {checkedEmail ? (
              <CheckEmail />
            ) : (
              <>
                <h1>Forgot password</h1>
                <p>Please enter the email you use to sign in to coinmap</p>
                <Form
                  wrapperCol={24}
                  name="normal_login"
                  layout="vertical"
                  initialValues={{ email: '', password: '', rememberMe: false }}
                  onFinish={onSubmit}
                  autoComplete="off"
                >
                  <Form.Item
                    wrapperCol={24}
                    name="email"
                    label="Email"
                    rules={[
                      {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                      },
                      {
                        required: true,
                        message: 'Please input your email',
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      placeholder="Enter email"
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
                        REQUEST PASSWORD RESET
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

export default ForgotPasswordPage;
