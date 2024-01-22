export function formatCurrency(amount: number) {
  if (!amount && amount !== 0) return '--';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'narrowSymbol',
  }).format(amount);
}

export function formatNumber(value: number, precision = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

export function formatNumberNormal(amount: number) {
  if (!amount && amount !== 0) return '--';
  return new Intl.NumberFormat('en-US').format(amount);
}

export function formatNumberPercent(amount: number) {
  if (!amount && amount !== 0) return '--';
  return new Intl.NumberFormat('en-US').format(amount) + '%';
}
