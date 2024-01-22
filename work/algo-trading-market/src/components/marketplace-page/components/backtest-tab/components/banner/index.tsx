import style from './index.module.scss';
import { formatCurrency } from '@/utils/format-number';
import { BACK_TEST } from '@/components/marketplace-page/interface';

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
  return (
    <div className={style.bannerContainer}>
      <div className={style.contentContainer}>
        {Object.keys(bannerData).map((key, i) => (
          <div key={i} className={style.boxContainer}>
            <div className={style.itemBox}>
              <span className={style.title}>{bannerData[key].title}</span>
            </div>
            <div
              className={[
                style.value,
                bannerData[key].value >= 0 ? style.up : style.down,
              ].join(' ')}
            >
              {formatCurrency(bannerData[key].value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
