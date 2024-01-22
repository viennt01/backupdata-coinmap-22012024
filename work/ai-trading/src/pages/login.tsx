import Head from 'next/head';
import LoginPage from '@/components/login-page';

export default function Login() {
  return (
    <>
      <Head>
        <title>A.I Trading | Login</title>
      </Head>
      <LoginPage />
    </>
  );
}

import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic(['common', 'header', 'login', 'form']);
