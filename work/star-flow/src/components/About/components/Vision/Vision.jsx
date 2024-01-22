import Image from 'next/image';
import useAnimation from './useAnimation';
import style from './Vision.module.scss';

export default function VisionSection() {
  useAnimation();
  return (
    <>
      <div id="vision_container" className={style.visionContainer}>
        <div className={style.contentContainer}>
          <div className={style.content}>
            <div id="vision_timeline_1" className={style.title}>
              Vision
            </div>
            <div id="vision_timeline_2" className={style.shortDescription}>
              Find your edge in trading
            </div>
            <p id="vision_timeline_2" className={style.description}>
              Coinmap is a modern, proficient, and full-featured trading
              ecosystem that surrounds global financial markets and permits
              trading in different asset classes such as Equities, Futures,
              Options, ETFs, and FX. Coinmap provides reliable real-time data,
              liquidity, and commission for profitable trades.
            </p>
          </div>
        </div>
        <div className={style.badgeContainer}>
          <div className={style.badgeContentContainer}>
            <div className={style.content}>
              Coinmap&apos;s ideal is to become the leading platform serving
              traders&apos; basic to advanced essentials and to bridge the gap
              between retail traders and professional trading organizations
              worldwide.
            </div>
          </div>
        </div>
      </div>
      <div id="ecosystems_container" className={style.container}>
        <div className={style.content}>
          <div id="ecosystems_timeline_1" className={style.title}>
            Moreover, Coinmap also constructed an ecosystem around trader
          </div>
          <div id="ecosystems_timeline_2">
            <Image
              src={'/images/about/2.png'}
              alt=""
              width={944}
              height={704}
            />
          </div>
        </div>
      </div>
    </>
  );
}
