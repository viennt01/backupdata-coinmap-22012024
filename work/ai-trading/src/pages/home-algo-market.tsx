import Head from 'next/head';
import Home from '@/components/home-algo-market-page';
import getAppLayout from '@/components/layout';
import { LAYOUT_TYPES } from '@/constants/common';

function HomePage() {
  return (
    <>
      <Head>
        <title>A.I Trading | Home</title>
      </Head>
      <Home />
    </>
  );
}

import { getStatic } from '@/lib/getStaticProps';

export const getStaticProps = getStatic([
  'common',
  'header',
  'homepage',
  'backtest',
  'form',
  'connect-broker',
  'disconnect-broker',
]);

HomePage.Layout = getAppLayout(LAYOUT_TYPES.DEFAULT);

export default HomePage;
