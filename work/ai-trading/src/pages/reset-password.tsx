import Head from 'next/head';
import ResetPasswordPage from '@/components/reset-password-page';

export default function Login() {
  return (
    <>
      <Head>
        <title>A.I Trading | Reset password</title>
      </Head>
      <ResetPasswordPage />
    </>
  );
}
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic(['common', 'header', 'reset-password']);
