import { ERROR_CODE } from '@/constants/error-code';
import { Input, ConfigProvider, Form, notification, Typography } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import { requestResetPassword, ResetPasswordData } from './fetcher';
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
  const { appTheme } = useContext(AppContext);
  const { translate } = useI18n();
  const { translate: translateForm } = useI18n('form');
  const { translate: translateForgotPassword } = useI18n('forgot-password');

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
            <Title className={style.title}>
              {translateForgotPassword('title_check_email')}
            </Title>
            <p className={style.description}>
              {translateForgotPassword('description_check_email')}{' '}
              <strong>{form.getFieldValue('email')}</strong>
            </p>

            <CustomButton
              className={style.actionButton}
              onClick={() => router.push(ROUTERS.LOGIN)}
            >
              {translateForgotPassword('back_to_login')}
            </CustomButton>
          </>
        ) : (
          <>
            <Title className={style.title}>
              {translateForgotPassword('title')}
            </Title>
            <p className={style.description}>
              {translateForgotPassword('description')}
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
                  name="email"
                  label={translateForm('label.email')}
                  rules={[
                    {
                      type: 'email',
                      message: translateForm('message_error_validator.email'),
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
                  <Input
                    size="large"
                    placeholder={translateForm('placeholder.email')}
                    autoComplete="off"
                  />
                </Form.Item>

                <Form.Item>
                  <CustomButton
                    type="submit"
                    className={style.actionButton}
                    loading={loading}
                  >
                    {translateForgotPassword('button_request_password')}
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
