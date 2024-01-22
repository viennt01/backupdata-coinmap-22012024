import style from './FeaturesSection.module.scss';
import useAnimation from './useAnimation';
export default function FeaturesSection() {
  useAnimation();
  return (
    <div className={style.container}>
      <div id="feature_container" className={style.content}>
        <div>
          <div id="feature_timeline_1" className={style.title}>
            Features
          </div>
          <div id="feature_timeline_2" className={style.containerDesc}>
            <div>
              <div className={style.shortDesc}>Unpacking your trading edge</div>
              <div className={style.note}>
                because we care who&apos;s in front of the screen.
              </div>
            </div>
            <div className={style.description}>
              An advanced platform including hi-end technical analysis
              instruments & exclusive AI-powered assistant that lets you enhance
              your trading performance, visualize market movements and achieve
              exceptional insights into the trading world.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
