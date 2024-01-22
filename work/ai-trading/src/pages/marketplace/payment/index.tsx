import Head from 'next/head';
import PaymentForm from '@/components/payment-form-page';
import getAppLayout from '@/components/layout';
import { LAYOUT_TYPES } from '@/constants/common';

function PaymentPage() {
  return (
    <>
      <Head>
        <title>A.I Trading | Payment</title>
      </Head>
      <PaymentForm />
    </>
  );
}

PaymentPage.Layout = getAppLayout(LAYOUT_TYPES.DEFAULT);

export default PaymentPage;
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'payment-form',
  'form',
]);
