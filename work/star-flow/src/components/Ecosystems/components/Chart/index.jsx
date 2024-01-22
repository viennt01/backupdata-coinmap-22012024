import Image from 'next/image';
import style from './index.module.scss';
import { Button, ConfigProvider } from 'antd';
import { SvgArrowRightLong } from '@/assets/images/svg/page';
import useAnimation from './useAnimation';
import { useRouter } from 'next/router';

export default function ChartSection() {
  const router = useRouter();
  useAnimation();
  return (
    <div className={style.container}>
      <div className={style.gridBackground}>
        <Image src="/images/grid-layout.png" alt="" width={1920} height={480} />
      </div>
      <div id="chart_container" className={style.content}>
        <div className={style.leftContainer}>
          <div className={style.leftContentContainer}>
            <div id="chart_timeline_2" className={style.title}>
              Chart
            </div>
            <p id="chart_timeline_3" className={style.shortDescription}>
              Not everything requires your money; all you need is an active
              account on Coinmap; we will equip you with:
            </p>
            <p id="chart_timeline_3" className={style.description}>
              + Chart data of more than 30 cryptocurrency pairs. <br />
              + Full basic features on the chart with traditional indicators.
              <br />
              + Full layout options
              <br />
              + 50+ innovative drawing tools
              <br />
              + Volume Profile indicators
              <br />
              + Custom time intervals
              <br />
            </p>
            <div id="chart_timeline_3" className={style.groupButton}>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#B02BFE',
                  },
                }}
              >
                <Button
                  onClick={() => router.push('/chart')}
                  className={style.trynowBtn}
                  size="large"
                  type="primary"
                >
                  TRY NOW <SvgArrowRightLong />
                </Button>
              </ConfigProvider>
            </div>
          </div>
        </div>
        <div className={style.rightContainer}>
          <div id="chart_timeline_1" className={style.imageContainer}>
            <Image
              src="/images/ecosystems/chart.png"
              alt=""
              width={832}
              height={818}
              layout="responsive"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
