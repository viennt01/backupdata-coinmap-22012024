import Head from 'next/head';
import { API_MESSSAGE } from '@/constant/messsage';
import { ERROR_CODE } from '@/fetcher/utils';
import Link from 'next/link';
import { useState } from 'react';
import PolicyDialog from '@/components/PolicyDialog';
import { userRegister } from './fetcher';
import style from './index.module.scss';

import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  ConfigProvider,
  Typography,
  Checkbox,
} from 'antd';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';
import { useSelector } from 'react-redux';
import { useAbility } from '@casl/react';
import { PageAbilityContext } from '@/utils/pagePermission/can';
import { PERMISSION_ACTIONS } from '@/config/consts/permission';
import { FEATURE_ID } from '@/config/consts/pagePermission';
import BlurModal from '@/components/BlurModal';
import PdfViewer from '@/components/PdfViewer';

const { Text } = Typography;

const RegisterPage = () => {
  const [isShowPolicy, setIsShowPolicy] = useState(false);
  const [showPdfPolicy, setShowPdfPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const merchantInfo = useSelector((state) => state.common.merchantInfo);
  const pageAbility = useAbility(PageAbilityContext);

  const closePolicyDialog = () => setIsShowPolicy(false);
  const openPolicyDialog = (e) => {
    e.preventDefault();
    setIsShowPolicy(true);
  };
  const [form] = Form.useForm();
  const [openNotification, contextHolder] = useNotification();

  const canIChange = (featureId) =>
    merchantInfo.checkPermission &&
    pageAbility.can(PERMISSION_ACTIONS.UPDATE, featureId);

  const onSubmit = (data) => {
    setLoading(true);
    const input = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    };
    const headers = { m_affiliate: merchantInfo.profile.code ?? '' };
    return userRegister(input, headers)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.resetFields([
            'firstName',
            'lastName',
            'email',
            'password',
            'repeatPassword',
            'confirmRule',
          ]);
          openNotification({
            type: NOTIFICATION_TYPE.SUCCESS,
            message: '',
            description: API_MESSSAGE.REGISTER.SUCCESS,
          });
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

  const renderPolicyButton = () => {
    return canIChange(FEATURE_ID.MODAL_POLICY) ? (
      <Text
        onClick={() => setShowPdfPolicy(true)}
        className="highlight-policy "
      >
        <a href="#">Our Policy</a>
      </Text>
    ) : (
      <Text onClick={openPolicyDialog} className="highlight-policy ">
        <a href="#">Coinmap&apos;s Policy</a>
      </Text>
    );
  };

  return (
    <div className={style.container}>
      <Head>
        <title>Register</title>
      </Head>
      {contextHolder}
      <div className={style.box__3}>
        <div className={style.group}>
          <div className={style.wrapped}>
            <div className={style.formWrapped}>
              <h1>Register</h1>
              <Form
                form={form}
                name="normal_login"
                layout="vertical"
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                  repeatPassword: '',
                  confirmRule: '',
                }}
                onFinish={onSubmit}
                autoComplete="off"
              >
                <Form.Item
                  name="firstName"
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
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Enter your Firstname"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
                  name="lastName"
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
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder="Enter your Lastname"
                    autoComplete="off"
                  />
                </Form.Item>
                <Form.Item
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
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder="Enter email"
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
                    <Form.Item
                      name="confirmRule"
                      rules={[
                        {
                          required: true,
                          message: 'Please check this checkbox',
                        },
                      ]}
                      valuePropName="checked"
                    >
                      <Checkbox>
                        Before registering, you need to be aware that this
                        product is in the process of building, and it may
                        contain bugs. By registering, you agree with{' '}
                        {renderPolicyButton()}.
                      </Checkbox>
                    </Form.Item>
                  </ConfigProvider>
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
                      Register
                    </Button>
                  </ConfigProvider>
                </Form.Item>

                <Form.Item>
                  <div className={style.registerContainer}>
                    <Text className={style.registerContainer}>
                      Already have an account?
                      <Link href="/login">
                        <a> Login</a>
                      </Link>
                    </Text>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <PolicyDialog show={isShowPolicy} handleClose={closePolicyDialog} />

      <BlurModal open={showPdfPolicy} onClose={() => setShowPdfPolicy(false)}>
        <PdfViewer url={merchantInfo.profile.config.policy_file?.url} />
      </BlurModal>
    </div>
  );
};

export default RegisterPage;
