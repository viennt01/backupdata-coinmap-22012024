import React, { useEffect } from 'react';
import { Layout, Button, Form, Input, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import CustomCard from '@/components/commons/custom-card';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  userLogin,
  validateToken,
  AdminLoginInput,
  AdminLoginOutput,
  AdminListEventOutput,
} from '@/utils/api-getters';
import { ERROR_CODE } from '@/constants/code-constants';
import { headers } from '@/fetcher/utils';
import { LOCAL_CACHE_KEYS } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { ROUTERS } from '@/constants/router';

const { Content } = Layout;
const { Title } = Typography;

const LoginPage: React.FC = () => {
  const router = useRouter();

  const checkToken = () => {
    const token = localStorage.getItem(LOCAL_CACHE_KEYS.CM_TOKEN);
    if (!token) return;
    headers.setToken(token);
    validateToken()
      .then((res: AdminListEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          router.replace(ROUTERS.AFFILIATE_MERCHANT);
        } else {
          localStorage.removeItem(LOCAL_CACHE_KEYS.CM_TOKEN);
        }
      })
      .catch(() => {
        localStorage.removeItem(LOCAL_CACHE_KEYS.CM_TOKEN);
      });
  };

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (formValues: AdminLoginInput) => {
    userLogin(formValues)
      .then((res: AdminLoginOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Login successfully');
          localStorage.setItem(LOCAL_CACHE_KEYS.CM_TOKEN, res.payload);
          headers.setToken(res.payload);
          router.replace(ROUTERS.AFFILIATE_MERCHANT);
        } else {
          errorToast(res.message);
        }
      })
      .catch((e: Error) => {
        errorToast('Login Failed');
        console.log(e);
      });
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#fff' }}>
      <Content
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CustomCard
          style={{
            maxWidth: 480,
            width: '100%',
            margin: 24,
            boxShadow: 'none',
            border: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '24px',
              gap: '8px',
              cursor: 'pointer',
            }}
          >
            <Image
              src="/images/coinmap-logo.svg"
              alt="logo"
              width={60}
              height={60}
            />
            <Title level={2} style={{ fontWeight: 'bold', margin: 0 }}>
              COINMAP ADMIN
            </Title>
          </div>
          <Form onFinish={handleSubmit}>
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input your Email!' }]}
            >
              <Input
                size="large"
                prefix={<UserOutlined />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your Password!' },
              ]}
            >
              <Input
                size="large"
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
            >
              SIGN IN
            </Button>
          </Form>
        </CustomCard>
      </Content>
    </Layout>
  );
};

export default LoginPage;
