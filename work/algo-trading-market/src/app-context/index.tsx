import { MerchantInfo, UserProfile } from '@/components/layout/interface';
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
}

const INITIAL_VALUE_CONTEXT = {
  openProgressModal: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleProgressModal: () => {},
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
  useEffect(() => {
    setValueContext((prev) => ({
      ...prev,
      toggleProgressModal,
      setAppWebsocket,
      setMerchantInfo,
      setUserInfo,
    }));
  }, []);
  return (
    <AppContext.Provider value={valueContext}>{children}</AppContext.Provider>
  );
}
