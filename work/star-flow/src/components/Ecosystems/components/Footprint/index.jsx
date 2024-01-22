import { useEffect } from 'react';
import style from './index.module.scss';
import useAnimation from './useAnimation';

export default function FootprintSection() {
  useAnimation();
  useEffect(() => {
    const element = document.getElementById('footprint_section');
    const r = document.querySelector(':root');
    const handleMouseMove = (e) => {
      if (r) {
        r.style.setProperty('--x', `${e.layerX}px`);
        r.style.setProperty('--y', `${e.layerY}px`);
      }
    };

    if (element) {
      element.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      if (element) {
        element.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className={style.container}>
      <div id="footprint_container" className={style.content}>
        <section
          id="footprint_timeline_1"
          className={style.footprintSectionContainer}
        >
          <div className={style.footprintSectionContainerBg}>
            <picture className={style.active}>
              <source srcSet="/images/footprint-1.png" />
              <img src="/images/footprint-1.png" alt="" loading="lazy" />
            </picture>
          </div>
          <div
            id="footprint_section_mask"
            className={style.footprintSectionContainerMask}
          >
            <picture className={style.active}>
              <source srcSet="/images/footprint-2.png" />
              <img src="/images/footprint-2.png" alt="" loading="lazy" />
            </picture>
          </div>
          <div
            id="footprint_timeline_2"
            className={style.footprintSectionContainerContent}
          >
            <div className={style.title}>Footprint</div>
            <div className={style.description}>
              Profitability on every candle - a system that reveals all inside a
              candle stick. Footprint showing the volume of transactions at each
              price which enables traders to analyze the strength between the
              buyer/seller, reducing the risk of being a gambler.
            </div>
          </div>
          <div
            id="footprint_section"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'black',
              zIndex: 4,
              opacity: 0,
            }}
          ></div>
        </section>
      </div>
    </div>
  );
}
