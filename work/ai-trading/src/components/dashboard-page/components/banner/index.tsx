import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import style from './index.module.scss';
import { formatCurrency } from '@/utils/format-number';
import useI18n from '@/i18n/useI18N';

export enum BANNER_TITLE {
  BALANCE,
  PNL_TODAY,
  PNL_7D,
  PNL_30D,
}

export interface BannerItem {
  [k: string]: {
    id: BANNER_TITLE;
    title: string;
    percent: number;
    value: number;
  };
}

interface Props {
  bannerData: BannerItem;
}

export default function Banner({ bannerData }: Props) {
  const { translate } = useI18n('dashboard');

  return (
    <div className={style.bannerContainer}>
      <h1 className={style.title}>{translate('banner.pnl_summary')}</h1>
      <div className={style.contentContainer}>
        {Object.keys(bannerData).map((key, i) => (
          <div key={i} className={style.boxContainer}>
            <div className={style.itemBox}>
              <span className={style.title}>{bannerData[key].title}</span>
              <span>
                {bannerData[key].percent >= 0 ? (
                  <CaretUpOutlined
                    className={[style.icon, style.up].join(' ')}
                  />
                ) : (
                  <CaretDownOutlined
                    className={[style.icon, style.down].join(' ')}
                  />
                )}

                <span
                  className={[
                    style.percent,
                    bannerData[key].percent >= 0 ? style.up : style.down,
                  ].join(' ')}
                >
                  {bannerData[key].percent.toFixed(2)}%
                </span>
              </span>
            </div>
            <div className={style.value}>
              {formatCurrency(bannerData[key].value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
