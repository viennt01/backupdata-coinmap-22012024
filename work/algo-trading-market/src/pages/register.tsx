import Head from 'next/head';
import RegisterPage from '@/components/register-page';
import { APP_NAME } from '@/constants/common';

export default function Login() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Register</title>
      </Head>
      <RegisterPage />
    </>
  );
}
