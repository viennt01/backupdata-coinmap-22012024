import Image from 'next/image';
import style from './Partner.module.scss';
import useAnimation from './useAnimation';

const LIST_PARTNER = [
  {
    url: '/images/logo/partner/logo.png',
  },
  {
    url: '/images/logo/partner/logo-1.png',
  },
  {
    url: '/images/logo/partner/logo-2.png',
  },
  {
    url: '/images/logo/partner/logo-3.png',
  },
  {
    url: '/images/logo/partner/logo-4.png',
  },
  {
    url: '/images/logo/partner/logo-5.png',
  },
  {
    url: '/images/logo/partner/logo-6.png',
  },
  {
    url: '/images/logo/partner/logo-7.png',
  },
  {
    url: '/images/logo/partner/logo-8.png',
  },
  {
    url: '/images/logo/partner/logo-9.png',
  },
  {
    url: '/images/logo/partner/logo-10.png',
  },
  {
    url: '/images/logo/partner/logo-11.png',
  },
  {
    url: '/images/logo/partner/logo-12.png',
  },
  {
    url: '/images/logo/partner/logo-13.png',
  },
  {
    url: '/images/logo/partner/logo-14.png',
  },
  {
    url: '/images/logo/partner/logo-15.png',
  },
  {
    url: '/images/logo/partner/logo-16.png',
  },
];

export default function PartnerSection() {
  useAnimation();
  return (
    <div className={style.container}>
      <div id="partner_container" className={style.contentContainer}>
        <div id="partner_timeline_1" className={style.title}>
          Partner
        </div>
        <div id="partner_timeline_2" className={style.iconPartnerContainer}>
          {LIST_PARTNER.map((item, i) => (
            <div key={i} className={style.iconPartnerItem}>
              <Image
                src={item.url}
                alt=""
                width={200}
                height={150}
                layout="responsive"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
