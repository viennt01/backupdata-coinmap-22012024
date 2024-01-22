import { formatNumber } from '@/utils/format-number';

export const calculateAmount = (
  price: number | string,
  quantity: number | string,
  discount_rate = 0,
  discount_amount = 0
) => {
  const amount =
    Number(price) * Number(quantity) * (1 - Number(discount_rate)) -
    Number(discount_amount);
  return formatNumber(amount, 2);
};

export const calculateDiscountAmount = (
  price: number | string,
  quantity: number | string,
  discount_rate = 0,
  discount_amount = 0
) => {
  const amount =
    Number(price) * Number(quantity) * Number(discount_rate) +
    Number(discount_amount);
  return formatNumber(amount, 2);
};
