import Image from 'next/image';
import style from './Help.module.scss';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { useState } from 'react';

const Item = ({ active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={[style.collapseItem, active ? style.active : ''].join(' ')}
    >
      <div
        className={[style.headerContaienr, active ? style.active : ''].join(
          ' '
        )}
      >
        <div className={style.title}>
          Why is BRIX Templates the best Webflow agency out there?
        </div>
        <div
          className={[style.arrowdownBtn, active ? style.active : ''].join(' ')}
        >
          {active ? <RightOutlined /> : <DownOutlined />}
        </div>
      </div>
      <div className={[style.content, active ? style.active : ''].join(' ')}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat.
      </div>
    </div>
  );
};

export default function Help() {
  const [activatedTab, setActivatedTab] = useState([1]);
  const handleClickCollapseItem = (value) => {
    if (activatedTab.some((a) => a === value)) {
      setActivatedTab((prev) => prev.filter((p) => p !== value));
    } else {
      setActivatedTab((prev) => [...prev, value]);
    }
  };
  return (
    <div className={style.container}>
      <div className={style.bannerContainer}>
        <Image
          src={'/images/help/6.png'}
          alt=""
          width={1920}
          height={369}
          layout="responsive"
        />
        <div className={style.title}>Help</div>
      </div>
      <div className={style.contentContainer}>
        <div className={style.title}>Frequently Asked Questions</div>
        <div>
          {[1, 2, 3, 4].map((i) => (
            <Item
              onClick={() => handleClickCollapseItem(i)}
              key={i}
              active={activatedTab.some((a) => a === i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
