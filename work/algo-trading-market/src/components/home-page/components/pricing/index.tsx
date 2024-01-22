import { Col, Row } from 'antd';
import React from 'react';

import style from './index.module.scss';
import CustomButton from '@/components/common/custom-button';

export interface IPlan {
  name: string;
  price: number | string;
  features: string[];
  isBest?: boolean;
}

const PLANS: IPlan[] = [
  {
    name: 'Package name',
    price: 99,
    features: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Sed do eiusmod tempor',
      'Incididunt ut labore',
      'Et dolore magna aliqua',
    ],
  },
  {
    isBest: true,
    name: 'Package name',
    price: 99,
    features: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Sed do eiusmod tempor',
      'Incididunt ut labore',
      'Et dolore magna aliqua',
      'Et dolore magna aliqua',
      'Consectetur adipiscing elit',
    ],
  },
  {
    name: 'Package name',
    price: 99,
    features: [
      'Lorem ipsum dolor sit amet',
      'Consectetur adipiscing elit',
      'Sed do eiusmod tempor',
      'Incididunt ut labore',
      'Et dolore magna aliqua',
    ],
  },
];

const Plan: React.FC<{ plan: IPlan }> = ({ plan }) => {
  const isBest = !!plan.isBest;
  return (
    <div className={`${style.plan} ${isBest ? style.best : ''}`}>
      {isBest ? <span className={style.bestBadge}>BEST SELLER</span> : null}
      <div className={style.innear}>
        <div className={style.name}>{plan.name}</div>
        <div className={style.price}>
          ${plan.price}
          <span>/month</span>
        </div>
        <CustomButton className={style.btn} append={<></>}>
          START TRIAL NOW
        </CustomButton>
        <p className={style.featTitle}>What’s included</p>
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PricingSection = () => {
  return (
    <section id="pricing" className={style.section}>
      <div className={style.container}>
        <p className={style.title}>Get started today</p>
        <p className={style.desc}>
          Choose which Plan suits your organization best.
        </p>
        <Row>
          {PLANS.map((plan, index) => (
            <Col key={index} span={24} xl={8} className={style.planCol}>
              <Plan plan={plan} />
            </Col>
          ))}
        </Row>
      </div>
    </section>
  );
};

export default PricingSection;
