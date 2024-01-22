import style from './index.module.scss';
import { formatCurrency, formatNumberPercent } from '@/utils/format-number';
import { BACK_TEST } from '@/components/home-page/interface';
import useI18n from '@/i18n/useI18N';

export enum BANNER_TITLE {
  TOTAL_PROFIT,
  TOTAL_PROFIT_BY_PIP,
  AVERAGE_PROFIT_BY_YEAR,
  AVERAGE_PROFIT_BY_YEAR_PERCENT,
}

type BannerItem = BACK_TEST['banner']['boxs'];

interface Props {
  bannerData: BannerItem;
}

export default function Banner({ bannerData }: Props) {
  const { translate: translateBacktest } = useI18n('backtest');
  return (
    <div className={style.bannerContainer}>
      <div className={style.contentContainer}>
        {Object.keys(bannerData).map((key, i) => (
          <div key={i} className={style.boxContainer}>
            <div className={style.itemBox}>
              <span className={style.title}>
                {translateBacktest(`banner.${bannerData[key].title}`)}
              </span>
            </div>
            <div
              className={[
                style.value,
                bannerData[key].value >= 0 ? style.up : style.down,
              ].join(' ')}
            >
              {bannerData[key].title.includes('(%)')
                ? formatNumberPercent(bannerData[key].value)
                : formatCurrency(bannerData[key].value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
