import Head from 'next/head';
import getAppLayout from '@/components/layout';
import TradingBot from '@/components/trading-bot-page';
import { LAYOUT_TYPES } from '@/constants/common';

function TradingBotPage() {
  return (
    <>
      <Head>
        <title>A.I Trading | A.I Trading</title>
      </Head>
      <TradingBot></TradingBot>
    </>
  );
}

TradingBotPage.Layout = getAppLayout(LAYOUT_TYPES.DASHBOARD);

export default TradingBotPage;
import { getStatic } from '@/lib/getStaticProps';
export const getStaticProps = getStatic([
  'common',
  'header',
  'dashboard',
  'connect-broker',
  'form',
  'disconnect-broker',
]);
