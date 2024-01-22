import Head from 'next/head';
import Faq from '@/components/faq/faq';
import withAuthentication from '@/hook/useAuthentication';

function Affiliate() {
  return (
    <>
      <Head>
        <title>Merchants | FAQ</title>
      </Head>
      <Faq />
    </>
  );
}

export default withAuthentication(Affiliate);
