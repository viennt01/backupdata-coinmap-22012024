import ROUTERS from '@/constants/router';
import SectionInfo from '../section-info';

import img from './assets/merchant.png';

const CONTENT = {
  title: 'Become a merchant',
  topDesc: 'AI Trading for Merchant',
  desc: 'Empowered your businesses with opportunity to join our "Become a Merchant" program. This initiative helps corporations expand their reach, create new opportunities, and increase revenue.',
  keyValues: [
    'Unique promotional programs.',
    'Customized Website and Commerce Design.',
    'Extremely Competitive and Rewarding Affiliate Program.',
  ],
  img: img,
  link: '#' as ROUTERS,
  btnText: 'COMING SOON',
};

const MerchantSection = () => <SectionInfo {...CONTENT} />;

export default MerchantSection;
