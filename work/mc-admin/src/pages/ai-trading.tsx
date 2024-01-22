import Head from 'next/head';
import BotList from '@/components/bot-list/bot-list';
import withAuthentication from '@/hook/useAuthentication';

function Affiliate() {
  return (
    <>
      <Head>
        <title>Merchants | A.I Trading</title>
      </Head>
      <BotList />
    </>
  );
}

export default withAuthentication(Affiliate);
