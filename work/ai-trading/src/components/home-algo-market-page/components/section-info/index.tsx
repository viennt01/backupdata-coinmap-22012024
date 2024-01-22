import style from './index.module.scss';
import React from 'react';
import { Col, Row } from 'antd';
import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import CustomButton from '@/components/common/custom-button';

interface Props {
  title: string;
  topDesc: string;
  desc: string;
  keyValues: string[];
  img: StaticImageData;
  link: string;
  btnText: string;
}

const InfoSection = (props: Props) => {
  return (
    <section className={style.section}>
      <div className="container">
        <Row gutter={16} className={style.row}>
          <Col span={24} xl={16}>
            <Row gutter={16}>
              <Col span={24} xl={3}>
                <p className={style.topDesc}>{props.topDesc}</p>
              </Col>
              <Col span={24} xl={{ span: 15, offset: 3 }}>
                <p className={style.title}>{props.title}</p>
                <p className={style.desc}>{props.desc}</p>
                <ul>
                  {props.keyValues.map((keyValue, index) => (
                    <li key={index}>{keyValue}</li>
                  ))}
                </ul>
                <Link href={props.link}>
                  <CustomButton className={style.btn} append={<></>}>
                    {props.btnText}
                  </CustomButton>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col span={24} xl={8} className={style.imgCol}>
            <Image className={style.img} src={props.img} alt={props.title} />
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default InfoSection;
