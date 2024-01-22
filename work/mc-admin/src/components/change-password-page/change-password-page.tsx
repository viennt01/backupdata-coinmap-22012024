import { ROUTERS } from '@/constant/router';
import { useRouter } from 'next/router';
import {
  Button,
  Form,
  Input,
  notification,
  Image,
  Typography,
  Card,
} from 'antd';
import style from './change-password.module.scss';
import { ChangePasswordData, updatePassword } from './fetcher';
import { ERROR_CODE } from '@/constant/error-code';
import { useState } from 'react';

const initialValues: ChangePasswordData = {
  current_password: '',
  new_password: '',
};

const { Title } = Typography;

export default function ChangePasswordPage() {
  const router = useRouter();
  const [notiApi, contextHolder] = notification.useNotification();
  const [loading, setLoading] = useState(false);
  const onFinish = (values: ChangePasswordData) => {
    setLoading(true);
    updatePassword(values)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          notiApi.success({
            message: '',
            description: 'Your password has been changed successfully',
            placement: 'topRight',
            duration: 3,
          });
          router.push(ROUTERS.HOME);
        }
      })
      .catch((err) => {
        const res = JSON.parse(err.message);
        notiApi.error({
          message: '',
          description: res.message,
          placement: 'topRight',
          duration: 3,
        });
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={style.container}>
      {contextHolder}
      <Card className={style.content} bordered={false}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '32px',
            gap: '16px',
            cursor: 'pointer',
          }}
          onClick={() => router.push(ROUTERS.HOME)}
        >
          <Image
            src="/images/atm-logo.svg"
            alt="logo"
            height={40}
            preview={false}
          />
          <Title level={2} style={{ fontWeight: 'bold', margin: 0 }}>
            MERCHANT ADMIN
          </Title>
        </div>
        <Form
          name="basic"
          initialValues={initialValues}
          onFinish={onFinish}
          labelCol={{ span: 9 }}
          autoComplete="off"
          size="large"
          labelAlign="left"
        >
          <Form.Item
            label="Current Password"
            name="current_password"
            rules={[
              { required: true, message: 'Please input current password!' },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="new_password"
            rules={[
              { required: true, message: 'Please input new password!' },
              {
                min: 8,
                message: 'Your password must be at least 8 characters!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="confirm_password"
            dependencies={['new_password']}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
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
            <Input.Password />
          </Form.Item>

          <Button
            style={{ marginBottom: 12 }}
            loading={loading}
            block
            type="primary"
            size="large"
            htmlType="submit"
          >
            Change Password
          </Button>
          <Button
            block
            size="large"
            type="primary"
            ghost
            onClick={() => router.push(ROUTERS.HOME)}
          >
            Back To Home
          </Button>
        </Form>
      </Card>
    </div>
  );
}
