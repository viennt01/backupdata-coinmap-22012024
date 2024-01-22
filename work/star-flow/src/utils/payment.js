export const formatNumber = (number, digits = 2) => {
  return Number(number || 0).toFixed(digits);
};

export const calculateAmount = (
  price,
  quantity,
  discount_rate = 0,
  discount_amount = 0
) => {
  const amount = price * quantity * (1 - discount_rate) - discount_amount;
  return formatNumber(amount, 2);
};

export const calculateDiscountAmount = (
  price,
  quantity,
  discount_rate = 0,
  discount_amount = 0
) => {
  const amount = price * quantity * discount_rate + discount_amount;
  return formatNumber(amount, 2);
};
