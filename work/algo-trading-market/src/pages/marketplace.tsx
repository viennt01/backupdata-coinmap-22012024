import Head from 'next/head';
import Marketplace from '@/components/marketplace-page';
import getAppLayout from '@/components/layout';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function MarketplacePage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Marketplace</title>
      </Head>
      <Marketplace />
    </>
  );
}

MarketplacePage.Layout = getAppLayout(LAYOUT_TYPES.PROFILE);

export default MarketplacePage;
