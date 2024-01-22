import { Layout } from '@/components/Layout';
import PaymentForm from '@/components/PaymentForm';
import { PAYMENT_TYPES } from '@/constant/codeConstants';

const PricingPaymentPage = () => {
  return <PaymentForm paymentType={PAYMENT_TYPES.PRICING} />;
};

PricingPaymentPage.Layout = Layout;

export default PricingPaymentPage;
