import Head from 'next/head';
import TransactionList from '@/components/transaction-list/transaction-list';
import withAuthentication from '@/hook/useAuthentication';

function Affiliate() {
  return (
    <>
      <Head>
        <title>Merchants | Orders</title>
      </Head>
      <TransactionList />
    </>
  );
}

export default withAuthentication(Affiliate);
