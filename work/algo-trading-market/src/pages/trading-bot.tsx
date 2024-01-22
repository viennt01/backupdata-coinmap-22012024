import Head from 'next/head';
import getAppLayout from '@/components/layout';
import TradingBot from '@/components/trading-bot-page';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function TradingBotPage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Trading Bot</title>
      </Head>
      <TradingBot></TradingBot>
    </>
  );
}

TradingBotPage.Layout = getAppLayout(LAYOUT_TYPES.MAIN);

export default TradingBotPage;
