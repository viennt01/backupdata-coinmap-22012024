import React from 'react';
import type { AppProps } from 'next/app';
import { NextPage } from 'next';
import AppContextProvider from '@/app-context';
import 'antd/dist/reset.css';
import '@/styles/globals.scss';
import { PageWithNoLayout } from '@/components/layout/no-layout';
import Head from 'next/head';
import AppWrapper from '@/components/layout/app-wrapper';
import { appWithTranslation } from 'next-i18next';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  Layout: React.ElementType;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const AppLayout = Component.Layout || PageWithNoLayout;
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <AppContextProvider>
        <AppWrapper>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </AppWrapper>
      </AppContextProvider>
    </>
  );
}

export default appWithTranslation(App);
