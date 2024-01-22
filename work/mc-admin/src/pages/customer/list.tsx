import Head from 'next/head';
import CustomerList from '@/components/customer/customer-list';
import withAuthentication from '@/hook/useAuthentication';

function Customer() {
  return (
    <>
      <Head>
        <title>Merchants | Customer</title>
      </Head>
      <CustomerList />
    </>
  );
}

export default withAuthentication(Customer);
