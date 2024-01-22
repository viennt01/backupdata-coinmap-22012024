import { Layout } from '@/components/Layout';
import PaymentCheckout from '@/components/PaymentCheckout';
import { PAYMENT_TYPES } from '@/constant/codeConstants';

const PricingCheckoutPage = () => {
  return <PaymentCheckout paymentType={PAYMENT_TYPES.PRICING} />;
};

PricingCheckoutPage.Layout = Layout;

export default PricingCheckoutPage;
