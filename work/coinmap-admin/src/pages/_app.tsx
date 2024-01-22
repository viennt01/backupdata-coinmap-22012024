import '../styles/globals.css';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import 'react-quill/dist/quill.snow.css';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  Layout?: React.ElementType;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const L = Component.Layout ? Component.Layout : React.Fragment;
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <link rel="favicon" href={'/images/coinmap-logo.svg'} />
        <link rel="shortcut icon" href={'/images/coinmap-logo.svg'} />
      </Head>
      <L>
        <Component {...pageProps} />
      </L>
    </>
  );
}

export default MyApp;
