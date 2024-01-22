import ChartSection from './components/Chart';
import EcosystemsSection from './components/Ecosystems';
import EducationSection from './components/Education';
import FinanceSection from './components/Finance';
import FootprintSection from './components/Footprint';
import HeatmapSection from './components/Heatmap';
import StockmapSection from './components/Stockmap';
import style from './Ecosystems.module.scss';

export default function Ecosystems() {
  return (
    <div className={style.container}>
      <EcosystemsSection />
      <div className={style.contentContainer}>
        <FootprintSection />
        <HeatmapSection />
        <EducationSection />
        <FinanceSection />
        <ChartSection />
        <StockmapSection />
      </div>
    </div>
  );
}
