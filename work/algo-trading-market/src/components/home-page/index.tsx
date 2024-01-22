import style from './index.module.scss';
import Hero from './components/hero';
import FeaturesSection from './components/features';
import ContactSection from './components/contact';
import CustomerSection from './components/customer';
import MerchantSection from './components/merchant';
import MarketInfoSection from './components/martker-info';
import PricingSection from './components/pricing';

export default function Home() {
  return (
    <div className={style.homePageContainer}>
      <Hero />
      <FeaturesSection />
      <CustomerSection />
      <MerchantSection />
      <MarketInfoSection />
      <PricingSection />
      <ContactSection />
    </div>
  );
}
