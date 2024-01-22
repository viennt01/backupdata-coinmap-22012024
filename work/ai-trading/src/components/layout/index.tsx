import React, { useContext, useEffect } from 'react';
import { notification } from 'antd';
import AppWebsocket from '@/fetcher/ws';
import { AppContext } from '@/app-context';
import { ERROR_MESSAGE } from '@/constants/message';
import LayoutDashboard from '@/components/layout/components/layout-dashboard';
import LayoutDefault from '@/components/layout/components/layout-default';
import { LAYOUT_TYPES } from '@/constants/common';

interface Props {
  children: React.ReactNode;
}

const WSS_URL = process.env.WSS_URL;

const LAYOUT = {
  [LAYOUT_TYPES.DEFAULT]: LayoutDefault,
  [LAYOUT_TYPES.DASHBOARD]: LayoutDashboard,
};

function getAppLayout(layoutType: LAYOUT_TYPES) {
  return function AppLayout({ children }: Props) {
    const { setAppWebsocket } = useContext(AppContext);
    const [apiNotification, contextHolder] = notification.useNotification();

    const AppLayout = LAYOUT[layoutType];

    useEffect(() => {
      let appSocket: AppWebsocket;
      if (WSS_URL) {
        appSocket = new AppWebsocket(WSS_URL);
        if (setAppWebsocket) {
          setAppWebsocket(appSocket);
          // try reconnect once
          appSocket.onError(() => {
            const appSocket = new AppWebsocket(WSS_URL);
            setAppWebsocket(appSocket);
            appSocket.onError(() => {
              apiNotification.error({ message: ERROR_MESSAGE.ERROR });
            });
          });
        }
      }
      return () => {
        if (appSocket) {
          appSocket.close();
        }
      };
    }, [setAppWebsocket, apiNotification]);

    return (
      <AppLayout>
        {contextHolder}
        {children}
      </AppLayout>
    );
  };
}

export default getAppLayout;
