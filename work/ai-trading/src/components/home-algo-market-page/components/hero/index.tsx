import style from './index.module.scss';
import { useContext } from 'react';
import { AppContext } from '@/app-context';

const Hero = () => {
  const { merchantInfo } = useContext(AppContext);

  return (
    <section id="hero" className={style.wrapper}>
      <div
        className={style.heroCover}
        style={{ backgroundImage: `url(${merchantInfo?.config.banner_url_1})` }}
      >
        <div className={`container ${style.container}`}>
          <div className={style.textCol}>
            <h2>GAME-CHANGING PROJECT</h2>
            <h2>IN TRADING INDUSTRY</h2>
            <div className={style.desc}>
              The first and leading library with thousands of
              <br />
              CRYPTOCURRENCY AND OTHER MARKET trading strategies.
            </div>
            <div className={style.comingSoon}>Coming soon</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
