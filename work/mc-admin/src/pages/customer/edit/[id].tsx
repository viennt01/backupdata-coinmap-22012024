import Head from 'next/head';
import withAuthentication from '@/hook/useAuthentication';
import CustomerEdit from '@/components/customer/customer-edit';

function CustomerEditPage() {
  return (
    <>
      <Head>
        <title>Merchants | Customer Edit</title>
      </Head>
      <CustomerEdit />
    </>
  );
}

export default withAuthentication(CustomerEditPage);
