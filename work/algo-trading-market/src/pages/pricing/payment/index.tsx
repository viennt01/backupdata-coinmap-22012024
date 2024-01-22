import Head from 'next/head';
import PaymentForm from '@/components/payment-form-page';
import getAppLayout from '@/components/layout';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function PaymentPage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Payment</title>
      </Head>
      <PaymentForm />
    </>
  );
}

PaymentPage.Layout = getAppLayout(LAYOUT_TYPES.PROFILE);

export default PaymentPage;
