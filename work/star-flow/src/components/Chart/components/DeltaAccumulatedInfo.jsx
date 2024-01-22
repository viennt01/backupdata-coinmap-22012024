import { format } from 'd3-format';

import styles from './DeltaAccumulatedChart.module.scss';

const numberFormat = format(',.3s');

const CumulativeDeltaInfo = ({ height, topDevider, heatmapData }) => {
  const currentCVD = heatmapData?.cvd?.current;
  // const minCVD = heatmapData?.cvd?.min;
  // const maxCVD = heatmapData?.cvd?.max;
  const colorClass = currentCVD && currentCVD < 0 ? styles.red : styles.green;
  return (
    <div className={styles.currentCVDInfo} style={{ top: topDevider, height }}>
      <div className={colorClass}>CVD</div>
      <div className={colorClass}>
        <strong>{currentCVD ? numberFormat(currentCVD) : '--'}</strong>
      </div>
      {/* <div className={styles.moreInfo}>
        <span>Min: {minCVD ? numberFormat(minCVD) : '--'}</span> |{' '}
        <span>Max: {maxCVD ? numberFormat(maxCVD) : '--'}</span>
      </div> */}
    </div>
  );
};

export default CumulativeDeltaInfo;
