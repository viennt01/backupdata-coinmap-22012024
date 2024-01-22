import { Button, ConfigProvider } from 'antd';
import Image from 'next/image';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import style from './BotSection.module.scss';
import useAnimation from './useAnimation';

export default function BotSection() {
  useAnimation();
  return (
    <div className={style.container}>
      <div className={style.backgroundContainer}></div>
      <div id="bot_container" className={style.contentContainer}>
        <div className={style.content}>
          <div className={style.leftContent}>
            <div>
              <div id="bot_timeline_2" className={style.title}>
                Coinmap A.I
              </div>
              <div id="bot_timeline_3" className={style.description}>
                Profitability auto-optimization powered by Artificial
                Intelligence.
              </div>
              <div id="bot_timeline_3" className={style.description}>
                Coinmap A.I optimizes profits by monitoring the selected market
                and detecting signals according to different strategies.
              </div>
            </div>
            <div id="bot_timeline_3" className={style.groupButton}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#B02BFE',
                  },
                }}
              >
                <Button className={style.trynowBtn} size="large" type="primary">
                  Comming soon... <SvgArrowRightLong />
                </Button>
              </ConfigProvider>
            </div>
          </div>
          <div id="bot_timeline_1" className={style.groupImage}>
            <Image
              src={'/images/home-page/coinmap-ai.png'}
              width={824}
              height={727}
              alt="info"
              layout="responsive"
              eager
            />
          </div>
        </div>
      </div>
    </div>
  );
}
