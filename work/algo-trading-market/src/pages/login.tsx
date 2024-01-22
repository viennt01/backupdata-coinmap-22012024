import Head from 'next/head';
import LoginPage from '@/components/login-page';
import { APP_NAME } from '@/constants/common';

export default function Login() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Login</title>
      </Head>
      <LoginPage />
    </>
  );
}
