import { Layout } from '@/components/Layout';
import withAntTheme from '@/components/_hocs/withAntTheme';
import { withAuthSync } from '@/utils/auth';
import { initSocketWorker } from '@/wokers/socketWithWorker';
import Head from 'next/head';
import { useCallback, useEffect } from 'react';
import { URLS } from '@/config';
import SignalTabs from './components/SignalTabs';

import style from './signal-dashboard.module.scss';
import { SVGCloseFill } from '@/assets/images/svg';
import { notification } from 'antd';

const SignalDashboard = () => {
  const [notiApi, notificationHolder] = notification.useNotification();
  const handleNewSignal = (data) => {
    notiApi.info({
      message: 'New bot Signal',
      description: (
        <>
          <div className={style.info}>
            <span>{data?.symbol}</span>
            <span>{data?.resolution}</span>
            <span>{data?.name}</span>
            <span className={style[data?.type?.toLowerCase()]}>
              {data?.type?.toLowerCase()}
            </span>
          </div>
          <div className={style.fakeLink}>Preview signal</div>
        </>
      ),
      placement: 'bottomLeft',
      icon: (
        <img
          src={data?.image_url}
          width={120}
          height={68}
          alt="signal preview"
        />
      ),
      closeIcon: <SVGCloseFill />,
      onClick: () => {
        window.open(window.location.href, '_blank');
      },
      className: style.signalNotification,
      duration: 0,
    });
  };

  /**
   * TODO: Replace with CustomEvent to centralize all event handlers from user socket
   */
  const subcribeNewSignals = useCallback(() => {
    return initSocketWorker({
      url: URLS.WS_LIMIT_DEVICE,
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        handleNewSignal(data);
      },
    });
  }, []);

  useEffect(() => {
    const workerIns = subcribeNewSignals();

    return () => {
      workerIns.ws.close();
    };
  }, []);

  return (
    <div className={style.container}>
      <div className={style.wrapper} id="page_content">
        <Head>
          <title>Signal Bot Dashboard</title>
        </Head>
        <h1>Signal Bot Dashboard</h1>
        <SignalTabs />
        {notificationHolder}
      </div>
    </div>
  );
};

SignalDashboard.Layout = Layout;

export default withAuthSync(withAntTheme(SignalDashboard));
