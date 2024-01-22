import Head from 'next/head';
import { API_MESSSAGE } from '@/constant/messsage';
import { ERROR_CODE, headersUploadFromData } from '@/fetcher/utils';
import { headers } from '@/fetcher/utils';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { localStore } from '@/utils/localStorage';
import { getUserProfile, userLogin } from './fetcher';
import { LOCAL_CACHE_KEYS } from '@/config';
import ResendEmail from './resend-email';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '@/redux/actions/userProfile';
import { GATEWAY, get } from '@/fetcher';
import style from './index.module.scss';
import { limitDevice } from '@/utils/limitDevice';

import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Row,
  ConfigProvider,
  Col,
  Typography,
  Modal,
} from 'antd';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

const { Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: onOffRegister } = useSWR(
    '/user/app-setting/ON_OFF_REGISTER',
    get({ gw: GATEWAY.API_USER_ROLES_GW }),
    { revalidateOnFocus: false }
  );

  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [openNotification, contextHolder] = useNotification();

  const onSubmit = (data) => {
    setLoading(true);
    const input = {
      email: data.email,
      password: data.password,
    };
    return userLogin(input)
      .then((res) => {
        // 200
        if (res.error_code === ERROR_CODE.SUCCESS) {
          localStore.set(LOCAL_CACHE_KEYS.CM_TOKEN, res.payload.token);
          headersUploadFromData.setToken(res.payload.token);
          headers.setToken(res.payload.token);
          openNotification({
            type: NOTIFICATION_TYPE.SUCCESS,
            message: '',
            description: API_MESSSAGE.LOGIN.SUCCESS,
          });
          limitDevice.deactivateOtherTabs();
          limitDevice.sendVerifyEvent();
          router.push('/');
        }
      })
      .then(() => {
        getUserProfile()
          .then((data) => {
            if (data.error_code === ERROR_CODE.SUCCESS) {
              dispatch(setUserProfile(data.payload));
            }
          })
          .catch((error) => {
            console.log('error', error);
          });
      })
      .catch((err) => {
        openNotification({
          type: NOTIFICATION_TYPE.ERROR,
          message: '',
          description: JSON.parse(err.message).message,
        });
        // popup modal resend email
        if (
          JSON.parse(err.message) &&
          JSON.parse(err.message).error_code === ERROR_CODE.EMAIL_NOT_VERIFIED
        ) {
          setOpenModal(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const email = useMemo(() => {
    return form.getFieldValue('email');
  }, [form]);

  const checkToken = useCallback(async () => {
    try {
      const result = await get({
        gw: GATEWAY.API_USER_ROLES_GW,
      })('/user/profile');

      if (result.error_code === ERROR_CODE.SUCCESS) {
        router.push('/');
      } else {
        localStore.remove(LOCAL_CACHE_KEYS.CM_TOKEN);
        limitDevice.closeSocket();
        limitDevice.logoutOtherTabs();
      }
    } catch (error) {
      console.log('error check token', error);
    }
  }, [router]);

  useEffect(() => {
    checkToken();
  }, []);
  return (
    <div className={style.container}>
      <Head>
        <title>Login</title>
      </Head>
      {contextHolder}
      <div className={style.box__3}>
        <div className={style.group}>
          <div className={style.formContainer}>
            <h1 className={style.loginTxt}>LOGIN</h1>
            <div>
              <Form
                form={form}
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
                    placeholder="Username"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your Password!',
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
                <Form.Item>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Row>
                      <Col flex={1}>
                        <ConfigProvider
                          theme={{
                            token: {
                              colorPrimary: '#B02BFE',
                            },
                          }}
                        >
                          <Checkbox>Remember me</Checkbox>
                        </ConfigProvider>
                      </Col>
                      <Col>
                        <Text>
                          <Link href="/forgot-password">
                            <a>Forgot password?</a>
                          </Link>
                        </Text>
                      </Col>
                    </Row>
                  </Form.Item>
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
                      Log in
                    </Button>
                  </ConfigProvider>
                </Form.Item>
                {onOffRegister &&
                  onOffRegister.error_code === ERROR_CODE.SUCCESS &&
                  onOffRegister.payload.value === 'ON' && (
                    <Form.Item>
                      <div className={style.registerContainer}>
                        <Text className={style.registerContainer}>
                          Need an account?{' '}
                          <Link href="/register">
                            <a>Register now</a>
                          </Link>
                        </Text>
                      </div>
                    </Form.Item>
                  )}
              </Form>
            </div>
          </div>
        </div>
      </div>
      <Modal open={openModal} onCancel={() => setOpenModal(false)} footer={''}>
        <ResendEmail email={email} setOpenModal={setOpenModal} />
      </Modal>
    </div>
  );
};

export default LoginPage;
