import Head from 'next/head';
import Home from '@/components/home-page';
import getAppLayout from '@/components/layout';
import { LAYOUT_TYPES } from '@/constants/common';
import { GetServerSideProps } from 'next';
import { getHomePageContent } from '@/components/home-page/fetcher';
import { HomePageContent } from '@/components/home-page/interface';
import { createContext } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getMerchantInfoServerSide } from '@/components/layout/fetcher';
import ROUTERS from '@/constants/router';

interface Props {
  homePageContent: HomePageContent;
}

interface ContentContext {
  homePageContent?: HomePageContent;
}

export const ContentContext = createContext<ContentContext>({});

function HomePage({ homePageContent }: Props) {
  return (
    <>
      <Head>
        <title>A.I Trading | Home</title>
      </Head>
      <ContentContext.Provider value={{ homePageContent }}>
        <Home />
      </ContentContext.Provider>
    </>
  );
}

HomePage.Layout = getAppLayout(LAYOUT_TYPES.DEFAULT);

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  req,
}) => {
  try {
    const fileName = [
      'common',
      'header',
      'homepage',
      'backtest',
      'form',
      'connect-broker',
      'disconnect-broker',
    ];

    const merchantRes = await getMerchantInfoServerSide(req);
    const [translateRes, contentRes] = await Promise.all([
      serverSideTranslations(locale as string, fileName),
      getHomePageContent(merchantRes.payload.code),
    ]);

    const homePageContent = contentRes.payload[0]?.data;

    return {
      props: {
        ...translateRes,
        homePageContent,
      },
    };
  } catch (error) {
    return {
      redirect: {
        permanent: false,
        destination: ROUTERS.ERROR,
      },
    };
  }
};

export default HomePage;
