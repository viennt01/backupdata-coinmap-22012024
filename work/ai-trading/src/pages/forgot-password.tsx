import Head from 'next/head';
import ForgotPasswordPage from '@/components/forgot-password-page';

export default function Login() {
  return (
    <>
      <Head>
        <title>A.I Trading | Forgot password</title>
      </Head>
      <ForgotPasswordPage />
    </>
  );
}
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'form',
  'forgot-password',
]);
