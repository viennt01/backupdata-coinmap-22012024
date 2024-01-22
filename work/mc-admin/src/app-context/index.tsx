import React, { useEffect, useState } from 'react';
import { MerchantInfo } from '@/interface/merchant-info';

interface AppContext {
  merchantInfo?: MerchantInfo;
  setMerchantInfo?: React.Dispatch<React.SetStateAction<MerchantInfo>>;
}

const INITIAL_VALUE_CONTEXT = {};

export const AppContext = React.createContext<AppContext>(
  INITIAL_VALUE_CONTEXT
);

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [valueContext, setValueContext] = useState(INITIAL_VALUE_CONTEXT);

  const setMerchantInfo = (merchantInfo: MerchantInfo) => {
    setValueContext((prev) => ({ ...prev, merchantInfo }));
  };
  useEffect(() => {
    setValueContext((prev) => ({
      ...prev,
      setMerchantInfo,
    }));
  }, []);
  return (
    <AppContext.Provider value={valueContext}>{children}</AppContext.Provider>
  );
}
