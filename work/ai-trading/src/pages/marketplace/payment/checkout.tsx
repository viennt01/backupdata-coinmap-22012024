import Head from 'next/head';
import PaymentCheckout from '@/components/payment-checkout-page';
import getAppLayout from '@/components/layout';
import { LAYOUT_TYPES } from '@/constants/common';

function PaymentCheckoutPage() {
  return (
    <>
      <Head>
        <title>A.I Trading | Checkout</title>
      </Head>
      <PaymentCheckout />
    </>
  );
}

PaymentCheckoutPage.Layout = getAppLayout(LAYOUT_TYPES.DEFAULT);

export default PaymentCheckoutPage;
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'payment-checkout',
]);
