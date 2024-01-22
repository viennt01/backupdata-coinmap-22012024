import Head from 'next/head';
import { Inter } from '@next/font/google';
import PaymentPage from '@/components/payment/payment';
import withAuthentication from '@/hook/useAuthentication';

const inter = Inter({ subsets: ['latin'] });

function Payment() {
  return (
    <>
      <Head>
        <title>Merchants | Payment</title>
      </Head>
      <main className={inter.className}>
        <PaymentPage />
      </main>
    </>
  );
}

export default withAuthentication(Payment);
