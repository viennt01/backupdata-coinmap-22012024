import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import theme from 'theme/theme';
import Layout from 'layouts/admin';
import React from 'react';
import ability, { AbilityContext } from 'context/casl';

interface MyAppProps extends AppProps {
  Component: AppProps['Component'] & { Layout: () => JSX.Element };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const L = Component.Layout ? Component.Layout : Layout;
  return (
    <ChakraProvider theme={theme}>
      <AbilityContext.Provider value={ability}>
        <L>
          <Component {...pageProps} />
        </L>
      </AbilityContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
