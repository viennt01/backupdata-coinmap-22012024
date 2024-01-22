import Head from 'next/head';
import Home from '@/components/home-page';
import getAppLayout from '@/components/layout';
import { APP_NAME, LAYOUT_TYPES } from '@/constants/common';

function HomePage() {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Home</title>
      </Head>
      <Home />
    </>
  );
}

HomePage.Layout = getAppLayout(LAYOUT_TYPES.PROFILE);

export default HomePage;
