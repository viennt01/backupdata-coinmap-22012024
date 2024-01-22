import Head from 'next/head';
import PaymentCheckout from '@/components/payment-checkout-page';
import getAppLayout from '@/components/layout';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function PaymentCheckoutPage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Checkout</title>
      </Head>
      <PaymentCheckout />
    </>
  );
}

PaymentCheckoutPage.Layout = getAppLayout(LAYOUT_TYPES.PROFILE);

export default PaymentCheckoutPage;
