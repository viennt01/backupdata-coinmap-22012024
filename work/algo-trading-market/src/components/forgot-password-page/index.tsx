import { ERROR_CODE } from '@/constants/error-code';
import { Input, ConfigProvider, Form, notification, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { requestResetPassword, ResetPasswordData } from './fetcher';
import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';
import Link from 'next/link';
import ROUTERS from '@/constants/router';
import { THEME_FORM } from '@/constants/theme';
import { SvgCheckSuccess, SvgArrowLeftLong } from '@/assets/images/svg';

const { Title } = Typography;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [apiNotification, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const [hasSendRequest, setHasSendRequest] = useState(false);

  const onSubmit = (data: ResetPasswordData) => {
    setLoading(true);
    requestResetPassword(data)
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
              <Title className={style.title}>Email sent</Title>{' '}
              <SvgCheckSuccess className={style.iconSuccess} />
            </div>
            <p className={style.description}>
              We have sent a link contain password recover and an instructions
              to your email <strong>{form.getFieldValue('email')}</strong>
            </p>
            <CustomButton
              className={style.actionButton}
              onClick={() => router.push(ROUTERS.LOGIN)}
              append={<></>}
              prepend={<SvgArrowLeftLong />}
            >
              BACK TO LOGIN
            </CustomButton>
          </>
        ) : (
          <>
            <Title className={style.title}>Forgot password</Title>
            <p className={style.description}>
              Please enter the email you use to login to ATM
            </p>
            <ConfigProvider theme={THEME_FORM}>
              <Form
                form={form}
                name="normal_login"
                layout="vertical"
                initialValues={{ email: '' }}
                onFinish={onSubmit}
                autoComplete="off"
              >
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
                  required={false}
                  hasFeedback
                  style={{ marginBottom: 24 }}
                >
                  <Input size="large" placeholder="Email" autoComplete="off" />
                </Form.Item>

                <Form.Item>
                  <CustomButton
                    type="submit"
                    className={style.actionButton}
                    loading={loading}
                  >
                    REQUEST PASSWORD RESET
                  </CustomButton>
                </Form.Item>
              </Form>
            </ConfigProvider>
            <div className={style.supportWrapper}>
              <Link className={style.support} href={ROUTERS.LOGIN}>
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
