/* eslint-disable @typescript-eslint/no-empty-function */
import {
  MerchantInfo,
  UserProfile,
  AppTheme,
  AppTemplate,
} from '@/components/layout/interface';
import AppWebsocket from '@/fetcher/ws';
import React, { useEffect, useState } from 'react';

interface AppContext {
  openProgressModal: boolean;
  toggleProgressModal: () => void;
  appWebbsocket?: AppWebsocket;
  setAppWebsocket?: (appWebbsocket: AppWebsocket) => void;

  merchantInfo?: MerchantInfo;
  setMerchantInfo?: (merchantInfo: MerchantInfo) => void;

  userInfo?: UserProfile;
  setUserInfo?: (userInfo: UserProfile) => void;

  appTheme: AppTheme;
  setAppTheme?: (appTheme: AppTheme) => void;
}

const INITIAL_VALUE_CONTEXT = {
  openProgressModal: false,
  toggleProgressModal: () => {},
  appTheme: {
    template: AppTemplate.AI_TRADING,
    colors: {
      primary: '#2864B4',
      secondary: '#0A1D38',
      secondary_lighten_1: '#475164',
      secondary_lighten_2: '#5A7490',
      secondary_darken_1: '#090E19',
      secondary_darken_2: '#050A0F',
      on_primary: '#EF6E2A',
      on_secondary: '#FFFFFF',
      on_secondary_darken_1: '#FFFFFF',
      on_secondary_darken_2: '#FFFFFF',
      on_secondary_lighten_1: '#FFFFFF',
      on_secondary_lighten_2: '#FFFFFF',
      on_price: '#C8B285',
    },
  },
};

export const AppContext = React.createContext<AppContext>(
  INITIAL_VALUE_CONTEXT
);

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [valueContext, setValueContext] = useState(INITIAL_VALUE_CONTEXT);
  const toggleProgressModal = () => {
    setValueContext((prev) => ({
      ...prev,
      openProgressModal: !prev.openProgressModal,
    }));
  };
  const setAppWebsocket = (appWebbsocket: AppWebsocket) => {
    setValueContext((prev) => ({ ...prev, appWebbsocket }));
  };
  const setMerchantInfo = (merchantInfo: MerchantInfo) => {
    setValueContext((prev) => ({ ...prev, merchantInfo }));
  };
  const setUserInfo = (userInfo: UserProfile) => {
    setValueContext((prev) => ({ ...prev, userInfo }));
  };
  const setAppTheme = (appTheme: AppTheme) => {
    setValueContext((prev) => ({ ...prev, appTheme }));
  };
  useEffect(() => {
    setValueContext((prev) => ({
      ...prev,
      toggleProgressModal,
      setAppWebsocket,
      setMerchantInfo,
      setUserInfo,
      setAppTheme,
    }));
  }, []);
  return (
    <AppContext.Provider value={valueContext}>{children}</AppContext.Provider>
  );
}
