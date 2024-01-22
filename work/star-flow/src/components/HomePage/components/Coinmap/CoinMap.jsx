import Image from 'next/image';
import { useEffect } from 'react';
import style from './CoinMap.module.scss';
import useAnimation from './useAnimation';
const TopSection = () => {
  useAnimation();
  useEffect(() => {
    const elemet = document.querySelectorAll('#imageAnimationItem');
    if (elemet) {
      elemet.forEach((e) => {
        e.style.animationName = 'flip';
      });
      setTimeout(() => {
        elemet.forEach((e) => {
          e.style.animationName = '';
        });
      }, 4500);
      setInterval(() => {
        elemet.forEach((e) => {
          e.style.animationName = 'flip';
        });
        setTimeout(() => {
          elemet.forEach((e) => {
            e.style.animationName = '';
          });
        }, 4500);
      }, 5000);
    }
  }, []);
  return (
    <div className={style.container}>
      <div id="coinmap_container" className={style.content}>
        <div id="coinmap_timeline_1" className={style.rowOne}>
          <div className={style.text}>WE BRING</div>
          <div id="top_section_img" className={style.groupImage}>
            <Image
              src={'/images/home-page/top.png'}
              width={824}
              height={120}
              alt="info"
              layout="responsive"
              eager
            />
          </div>
        </div>

        <div id="coinmap_timeline_2" className={style.rowTwo}>
          <div className={style.text}>TRADING</div>
          <div className={style.imageAnimationGroup}>
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  `}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem1}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem2}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem3}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem4}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem5}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem6}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem7}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem8}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem9}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem10}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem11}`}
            />
            <div
              id="imageAnimationItem"
              className={`${style.imageAnimationItem}  ${style.imageAnimationItem12}`}
            />
          </div>
        </div>
        <div id="coinmap_timeline_3" className={style.rowThree}>
          <div id="top_section_img" className={style.groupImage}>
            <Image
              src={'/images/home-page/bot.png'}
              width={600}
              height={120}
              alt="info"
              layout="responsive"
              eager
            />
          </div>
          <div className={style.text}>TO EVERYONE</div>
        </div>
      </div>
    </div>
  );
};

export default TopSection;
