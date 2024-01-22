import { Typography } from 'antd';
import Banner, { BannerItem, BANNER_TITLE } from './components/banner';
import BotListComponent from '../common/bot-list';
import { useState } from 'react';

const { Title } = Typography;

const initialBannerData: BannerItem = {
  [BANNER_TITLE.BALANCE]: {
    id: BANNER_TITLE.BALANCE,
    title: 'Total Balance',
    percent: 0, // total gain
    value: 0, // total balance current
  },
  [BANNER_TITLE.PNL_TODAY]: {
    id: BANNER_TITLE.PNL_TODAY,
    title: 'Today’s PNL',
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

export default function Dashboard() {
  const [bannerData, setBannerData] = useState<BannerItem>(initialBannerData);
  return (
    <>
      <Title>DASHBOARD</Title>
      <Banner bannerData={bannerData} />
      <BotListComponent setBannerData={setBannerData} />
    </>
  );
}
