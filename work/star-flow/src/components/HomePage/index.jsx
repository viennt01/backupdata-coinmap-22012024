import CoinMap from './components/Coinmap/CoinMap';
import FeaturesSection from './components/Feature/FeaturesSection';
import FootprintSection from './components/Footprint';
import HeatmapSection from './components/Heatmap';
import BotSection from './components/Bot/BotSection';
import style from './index.module.scss';
import Head from 'next/head';

const HomePage = () => {
  return (
    <div className={style.container}>
      <Head>
        <link rel="canonical" href="https://cextrading.io/" />
        <title>CoinMap CEX Trading Platform</title>
      </Head>
      <CoinMap />
      <FeaturesSection />
      <FootprintSection />
      <HeatmapSection />
      <BotSection />
    </div>
  );
};

export default HomePage;
