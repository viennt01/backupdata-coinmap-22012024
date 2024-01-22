import { ERROR_CODE } from '@/constants/error-code';
import { SUCCESS_MESSAGE } from '@/constants/message';
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
import { useContext, useState } from 'react';
import { RegisterData, userRegister } from './fetcher';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import Link from 'next/link';
import ROUTERS from '@/constants/router';
import { THEME_FORM } from '@/constants/theme';
import COLORS from '@/constants/color';
import PdfViewer from '@/components/common/pdf-viewer';
import AppModal from '@/components/modal';
import { AppContext } from '@/app-context';

const { Title } = Typography;

export default function RegisterPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [apiNotification, contextHolder] = notification.useNotification();
  const [showPdfPolicy, setShowPdfPolicy] = useState(false);
  const { merchantInfo } = useContext(AppContext);

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
            description: SUCCESS_MESSAGE.SUCCESS,
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

  return (
    <div className={style.container}>
      {contextHolder}
      <div className={style.formContainer}>
        <Title className={style.loginTxt}>GET STARTED</Title>
        <ConfigProvider theme={THEME_FORM}>
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
              label="Repeat your password"
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
              <Row>
                <Col flex="1">
                  <ConfigProvider
                    theme={{
                      token: {
                        colorBgContainer: COLORS.WHITE,
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
                              new Error('Please check this checkbox')
                            );
                          },
                        }),
                      ]}
                      valuePropName="checked"
                    >
                      <Checkbox>
                        I agree with ATM{' '}
                        <span
                          className={style.forgotPassword}
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPdfPolicy(true);
                          }}
                        >
                          Term and Services
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
                REGISTER
              </CustomButton>
            </Form.Item>
          </Form>
        </ConfigProvider>
        <div className={style.supportWrapper}>
          Already have an account?{' '}
          <Link className={style.support} href={ROUTERS.LOGIN}>
            Login
          </Link>
        </div>
      </div>

      <AppModal open={showPdfPolicy} close={() => setShowPdfPolicy(false)}>
        <PdfViewer url={merchantInfo?.config?.policy_file?.url} />
      </AppModal>
    </div>
  );
}
