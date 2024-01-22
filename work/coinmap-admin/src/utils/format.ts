import dayjs from 'dayjs';

export function formatDate(
  value: dayjs.ConfigType,
  formatString = 'HH:mm - DD/MM/YYYY'
) {
  if (value) {
    return dayjs(value).format(formatString);
  }
  return dayjs().format(formatString);
}

export function formatNumber(value: number, precision = 0) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}
