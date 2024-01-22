import React, { useContext, useEffect } from 'react';
import { notification } from 'antd';
import AppWebsocket from '@/fetcher/ws';
import { AppContext } from '@/app-context';
import { ERROR_MESSAGE } from '@/constants/message';
import LayoutMain from '@/components/layout/components/layout-main';
import LayoutProfile from '@/components/layout/components/layout-profile';
import { LAYOUT_TYPES } from '@/constants/common';

interface Props {
  children: React.ReactNode;
}
const WSS_URL = process.env.WSS_URL;

function getAppLayout(layoutType?: string) {
  return function AppLayout({ children }: Props) {
    const { setAppWebsocket } = useContext(AppContext);
    const [apiNotification, contextHolder] = notification.useNotification();

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

    switch (layoutType) {
      case LAYOUT_TYPES.PROFILE: {
        return (
          <LayoutProfile>
            {contextHolder}
            {children}
          </LayoutProfile>
        );
      }
      default: {
        return (
          <LayoutMain>
            {contextHolder}
            {children}
          </LayoutMain>
        );
      }
    }
  };
}

export default getAppLayout;
