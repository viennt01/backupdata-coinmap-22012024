import CloseChartButton from '@/components/ChartSection/CloseChartButton';
import Link from 'next/link';
import style from './style.module.scss';

const UpgradeAlertSection = ({ chartId }) => {
  return (
    <>
      <div className={style.header}>
        <div className="customDragHandler" />
        <CloseChartButton chartId={chartId} />
      </div>
      <div className={style.upgradeCover}>
        <p>Please upgrade your plan to use more panels</p>
        <div>
          <Link href="/pricing">
            <a
              title="Upgrade now"
              className="btn btn-cm-primary btn-primary mt-3"
            >
              Upgrade
            </a>
          </Link>
        </div>
      </div>
    </>
  );
};

export default UpgradeAlertSection;
