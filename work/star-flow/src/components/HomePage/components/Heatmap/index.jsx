import Image from 'next/image';
import style from './index.module.scss';
import useAnimation from './useAnimation';
const HeatmapSection = () => {
  useAnimation();
  return (
    <div className={style.container}>
      <div id="heatmap_container" className={style.content}>
        <div id="heatmap_timeline_1" className={style.title}>
          Heatmap
        </div>
        <div id="heatmap_timeline_1" className={style.description}>
          Profitability on every second - the grandest trading creation. Heatmap
          is the gateway to quantum trading world, where every slightest market
          movement is under your monitoring. Trading with liquidity, market
          trends, hidden price patterns, and order flow like never before.
        </div>
      </div>
      <div id="heatmap_timeline_2" className={style.imageGroup}>
        <Image
          src={'/images/home-page/heatmap.png'}
          width={1920}
          height={803}
          alt="info"
          layout="responsive"
          priority
        />
      </div>
    </div>
  );
};

export default HeatmapSection;
