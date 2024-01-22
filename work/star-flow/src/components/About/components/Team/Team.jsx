import Image from 'next/image';
import style from './Team.module.scss';

const TEAM_DATA = [
  {
    url: '/images/logo/team/default.png',
    name: 'Mr. NGUYEN VU TUAN HAI',
    position: 'Fouder',
  },
  {
    url: '/images/logo/team/default.png',
    name: 'Mr. Joe',
    position: 'CEO',
  },
  {
    url: '/images/logo/team/default.png',
    name: 'Mr. PHAM HONG PHUOC TU',
    position: 'CMO',
  },
  {
    url: '/images/logo/team/default.png',
    name: 'Ms. LAN PHAN',
    position: 'COO',
  },
  {
    url: '/images/logo/team/default.png',
    name: 'Mr. TOAN NGUYEN',
    position: 'CTO',
  },
  {
    url: '/images/logo/team/default.png',
    name: 'Mr. TUAN',
    position: 'Head of Research',
  },
  {
    url: '/images/logo/team/default.png',
    name: 'Mr. SI a.k.a LE NGOC NAM',
    position: 'Professional Trader',
  },
];

const LastItem = () => {
  return (
    <div className={style.itemContainer}>
      <div className={style.lastItem}>
        <div className={style.itemAvatart}>
          <Image
            src={'/images/logo/binance-future.png'}
            alt=""
            width={224}
            height={224}
            layout="responsive"
          />
        </div>
        <div className={style.itemContent}>
          <div className={style.name}>Mr. NGUYEN VU TUAN HAI</div>
          <div className={style.position}>CEO</div>
        </div>
      </div>
      <div className={style.lastItemContent}>
        <div>+50</div>
        <div>STAFFS</div>
      </div>
    </div>
  );
};

const Item = ({ teamer }) => {
  return (
    <div className={style.itemContainer}>
      <div>
        <div className={style.itemAvatart}>
          <Image
            src={teamer.url}
            alt=""
            width={224}
            height={224}
            layout="responsive"
          />
        </div>
        <div className={style.itemContent}>
          <div className={style.name}>{teamer.name}</div>
          <div className={style.position}>{teamer.position}</div>
        </div>
      </div>
    </div>
  );
};

export default function TeamSection() {
  return (
    <div className={style.container}>
      <div className={style.contentContainer}>
        <div className={style.titleContainer}>
          <span className={style.title}>Team</span>
          <p className={style.description}>
            Hi ! Let&apos;s meet the team that refine your trading
          </p>
        </div>

        <div className={style.iconPartnerContainer}>
          {TEAM_DATA.map((teamer, i) => (
            <Item key={i} teamer={teamer} />
          ))}
          <LastItem />
        </div>
      </div>
    </div>
  );
}
