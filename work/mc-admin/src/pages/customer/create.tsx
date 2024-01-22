import Head from 'next/head';
import withAuthentication from '@/hook/useAuthentication';
import CustomerCreate from '@/components/customer/customer-create';

function CustomerCreatePage() {
  return (
    <>
      <Head>
        <title>Merchants | Customer Create</title>
      </Head>
      <CustomerCreate />
    </>
  );
}

export default withAuthentication(CustomerCreatePage);
