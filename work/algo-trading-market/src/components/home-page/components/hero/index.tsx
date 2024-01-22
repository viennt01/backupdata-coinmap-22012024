import style from './index.module.scss';
import Image from 'next/image';

import aiBotImg from './assets/ai-bot.png';

const Hero = () => {
  return (
    <section id="hero" className={style.wrapper}>
      <div className={style.heroCover}>
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
          <div className={style.imgCol}>
            <Image src={aiBotImg} alt="AI Bot" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
