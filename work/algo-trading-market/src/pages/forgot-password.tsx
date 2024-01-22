import Head from 'next/head';
import ForgotPasswordPage from '@/components/forgot-password-page';
import { APP_NAME } from '@/constants/common';

export default function Login() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Forgot password</title>
      </Head>
      <ForgotPasswordPage />
    </>
  );
}
