import Head from 'next/head';
import Marketplace from '@/components/marketplace-page';
import getAppLayout from '@/components/layout';
import { LAYOUT_TYPES } from '@/constants/common';

function MarketplacePage() {
  return (
    <>
      <Head>
        <title>A.I Trading | Marketplace</title>
      </Head>
      <Marketplace />
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

MarketplacePage.Layout = getAppLayout(LAYOUT_TYPES.DEFAULT);

export default MarketplacePage;
