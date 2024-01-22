import Head from 'next/head';
import ResetPasswordPage from '@/components/reset-password-page';
import { APP_NAME } from '@/constants/common';

export default function Login() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Reset password</title>
      </Head>
      <ResetPasswordPage />
    </>
  );
}
