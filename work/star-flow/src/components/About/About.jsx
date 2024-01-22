import style from './About.module.scss';
import VisionSection from './components/Vision/Vision';

export default function Help() {
  return (
    <div className={style.container}>
      <VisionSection />
      {/* <TeamSection /> */}
      {/* <PartnerSection /> */}
    </div>
  );
}
