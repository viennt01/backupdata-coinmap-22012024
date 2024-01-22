import style from './index.module.scss';
import Banner, { BannerItem, BANNER_TITLE } from './components/banner';
import BotListComponent from '../common/bot-list';
import { useState } from 'react';
import useI18n from '@/i18n/useI18N';

export default function Dashboard() {
  const { translate } = useI18n('dashboard');

  const initialBannerData: BannerItem = {
    [BANNER_TITLE.BALANCE]: {
      id: BANNER_TITLE.BALANCE,
      title: `${translate('banner.total_balance')}`,
      percent: 0, // total gain
      value: 0, // total balance current
    },
    [BANNER_TITLE.PNL_TODAY]: {
      id: BANNER_TITLE.PNL_TODAY,
      title: `${translate('banner.pnl_today')}`,
      percent: 0,
      value: 0,
    },
    [BANNER_TITLE.PNL_7D]: {
      id: BANNER_TITLE.PNL_7D,
      title: '7D PNL',
      percent: 0,
      value: 0,
    },
    [BANNER_TITLE.PNL_30D]: {
      id: BANNER_TITLE.PNL_30D,
      title: '30D PNL',
      percent: 0,
      value: 0,
    },
  };

  const [bannerData, setBannerData] = useState<BannerItem>(initialBannerData);

  return (
    <>
      <h1 className={style.title}>DASHBOARD</h1>
      <Banner bannerData={bannerData} />
      <BotListComponent setBannerData={setBannerData} />
    </>
  );
}
