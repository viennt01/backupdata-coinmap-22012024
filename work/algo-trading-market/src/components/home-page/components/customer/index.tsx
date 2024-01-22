import { Col, Row } from 'antd';
import React from 'react';

import style from './index.module.scss';
import img from './assets/img-for-customer.png';
import Image from 'next/image';
import Link from 'next/link';
import ROUTERS from '@/constants/router';
import CustomButton from '@/components/common/custom-button';

const CONTENT = {
  title: 'ALGO TRADING FOR EVERYONE',
  topDesc: 'AI Trading for Customer',
  desc: 'The revolutionary platform that brings the power of algorithmic trading to your fingertips. Experience the next generation of trading with our user-friendly interface, designed for traders of all levels. Say goodbye to tedious manual trading and embrace the future of investing.',
  keyValues: [
    'Save your precious time.',
    'One-click to go.',
    'Full-depth customization.',
  ],
  img: img,
  link: ROUTERS.MARKETPLACE,
  btnText: 'GO TO MARKET',
};

export const InfoSection: React.FC<{ info: typeof CONTENT }> = ({ info }) => {
  return (
    <section className={style.section}>
      <div className="container">
        <Row gutter={16} className={style.row}>
          <Col span={24} xl={16}>
            <Row gutter={16}>
              <Col span={24} xl={3}>
                <p className={style.topDesc}>{info.topDesc}</p>
              </Col>
              <Col span={24} xl={{ span: 15, offset: 3 }}>
                <p className={style.title}>{info.title}</p>
                <p className={style.desc}>{info.desc}</p>
                <ul>
                  {info.keyValues.map((keyValue, index) => (
                    <li key={index}>{keyValue}</li>
                  ))}
                </ul>
                <Link href={info.link} title="Go to market">
                  <CustomButton className={style.btn} append={<></>}>
                    {info.btnText}
                  </CustomButton>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={8} className={style.imgCol}>
            <Image className={style.img} src={info.img} alt={info.title} />
          </Col>
        </Row>
      </div>
    </section>
  );
};

const CustomerSection = () => <InfoSection info={CONTENT} />;

export default CustomerSection;
