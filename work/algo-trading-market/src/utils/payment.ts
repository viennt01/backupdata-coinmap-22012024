import { formatNumber } from '@/utils/format-number';

export const calculateAmount = (
  price: number,
  quantity: number,
  discount_rate = 0,
  discount_amount = 0
) => {
  const amount = price * quantity * (1 - discount_rate) - discount_amount;
  return formatNumber(amount, 2);
};

export const calculateDiscountAmount = (
  price: number,
  quantity: number,
  discount_rate = 0,
  discount_amount = 0
) => {
  const amount = price * quantity * discount_rate + discount_amount;
  return formatNumber(amount, 2);
};
