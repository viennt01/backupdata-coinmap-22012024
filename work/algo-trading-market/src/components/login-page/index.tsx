import { AppContext } from '@/app-context';
import { ERROR_CODE } from '@/constants/error-code';
import { LOCAL_STORAGE_KEYS } from '@/constants/localstorage';
import { SUCCESS_MESSAGE } from '@/constants/message';
import { headers } from '@/fetcher/utils';
import { appLocalStorage } from '@/utils/localstorage';
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
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { getUserProfile, LoginData, userLogin } from './fetcher';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import Link from 'next/link';
import ROUTERS from '@/constants/router';
import { THEME_FORM } from '@/constants/theme';

const { Title } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const { merchantInfo, setUserInfo } = useContext(AppContext);
  const [apiNotification, contextHolder] = notification.useNotification();
  const router = useRouter();

  const fetchUserInfo = () => {
    getUserProfile()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          if (setUserInfo) {
            setUserInfo(res.payload);
          }
        }
      })
      .catch(() => {
        if (setUserInfo) {
          setUserInfo({});
        }
        appLocalStorage.remove(LOCAL_STORAGE_KEYS.TOKEN);
        headers.setToken(null);
        router.replace(ROUTERS.LOGIN);
      });
  };

  const onSubmit = (data: LoginData) => {
    setLoading(true);
    const input: LoginData = {
      email: data.email,
      password: data.password,
    };
    if (merchantInfo) {
      input.m_affiliate = merchantInfo.code;
    }
    return userLogin(input)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          appLocalStorage.set(LOCAL_STORAGE_KEYS.TOKEN, res.payload.token);
          headers.setToken(res.payload.token);
          apiNotification.success({
            message: '',
            description: SUCCESS_MESSAGE.SUCCESS,
          });
          fetchUserInfo();
          router.push(ROUTERS.DASHBOARD);
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

  const checkToken = async () => {
    getUserProfile()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          router.push(ROUTERS.HOME);
        }
      })
      .catch((err) => {
        console.log('Error check token', err);
      });
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <div className={style.container}>
      {contextHolder}
      <div className={style.formContainer}>
        <Title className={style.loginTxt}>LOGIN</Title>
        <ConfigProvider theme={THEME_FORM}>
          <Form
            form={form}
            name="normal_login"
            layout="vertical"
            initialValues={{ email: '', password: '', rememberMe: false }}
            onFinish={onSubmit}
            autoComplete="off"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                {
                  type: 'email',
                  message: 'Email invalid',
                },
                {
                  required: true,
                  message: 'Please input email',
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
              label="Password"
              rules={[
                {
                  required: true,
                  message: 'Please input password',
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
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Row gutter={[0, 16]}>
                  <Col flex={1}>
                    <ConfigProvider
                      theme={{
                        token: {
                          colorBgContainer: '#FFFFFF',
                        },
                      }}
                    >
                      <Checkbox>Remember me</Checkbox>
                    </ConfigProvider>
                  </Col>
                  <Col>
                    <Link
                      className={style.forgotPassword}
                      href={ROUTERS.FORGOT_PASSWORD}
                    >
                      Forgot password?
                    </Link>
                  </Col>
                </Row>
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <CustomButton
                type="submit"
                className={style.loginFormButton}
                loading={loading}
              >
                LOGIN
              </CustomButton>
            </Form.Item>
          </Form>
        </ConfigProvider>
        <div className={style.supportWrapper}>
          Need an account?{' '}
          <Link className={style.support} href={ROUTERS.REGISTER}>
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
}
