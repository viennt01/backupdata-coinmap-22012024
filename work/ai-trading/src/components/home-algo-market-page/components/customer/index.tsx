import React from 'react';
import img from './assets/customer.png';
import ROUTERS from '@/constants/router';
import SectionInfo from '../section-info';

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
  link: ROUTERS.MARKETPLACE_PAGE,
  btnText: 'GO TO MARKET',
};

const CustomerSection = () => <SectionInfo {...CONTENT} />;

export default CustomerSection;
