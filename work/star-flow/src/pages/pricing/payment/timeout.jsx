import { Layout } from '@/components/Layout';
import PaymentTimeout from '@/components/PaymentTimeout';
import { PAYMENT_TYPES } from '@/constant/codeConstants';

const PricingTimeoutPage = () => {
  return <PaymentTimeout paymentType={PAYMENT_TYPES.PRICING} />;
};

PricingTimeoutPage.Layout = Layout;

export default PricingTimeoutPage;
