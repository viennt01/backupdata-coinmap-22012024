import Head from 'next/head';
import RegisterPage from '@/components/register-page';

export default function Login() {
  return (
    <>
      <Head>
        <title>A.I Trading | Register</title>
      </Head>
      <RegisterPage />
    </>
  );
}

import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'login',
  'form',
  'register',
]);
