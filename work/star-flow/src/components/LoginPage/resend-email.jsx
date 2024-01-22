import { ERROR_CODE } from '@/fetcher/utils';
import { resendEmail } from './fetcher';
import style from './index.module.scss';

import { UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, ConfigProvider } from 'antd';
import useNotification, { NOTIFICATION_TYPE } from '@/hook/notification';

const ResendEmail = ({ email, setOpenModal }) => {
  const [form] = Form.useForm();
  const [openNotification, contextHolder] = useNotification();

  const onSubmit = (data) => {
    const input = {
      email: data.email,
    };
    return resendEmail(input)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setOpenModal(false);
          openNotification({
            type: NOTIFICATION_TYPE.SUCCESS,
            message: '',
            description: 'Please check your email',
          });
        }
      })
      .catch((err) => {
        openNotification({
          type: NOTIFICATION_TYPE.ERROR,
          message: '',
          description: JSON.parse(err.message).message,
        });
      });
  };
  return (
    <div className={style.resendEmailBox}>
      {contextHolder}
      <div className={style.wrapped}>
        <div className={style.content}>
          <h1>Resend verification email</h1>
          <p>Please enter the email you use to resend verification email</p>

          <Form
            form={form}
            wrapperCol={24}
            name="normal_login"
            layout="vertical"
            initialValues={{ email: email }}
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
                  message: 'Please input your Username!',
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
                >
                  Resend email
                </Button>
              </ConfigProvider>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ResendEmail;
