import dayjs from 'dayjs';

const DEFAULT_STRING_FORMAT = 'HH:mm DD/MM/YYYY';

export function formatDate(
  date: string | number,
  stringFormat = DEFAULT_STRING_FORMAT
) {
  return dayjs(date).format(stringFormat);
}

export function formatLocaleDate(date: string | number, locale = 'en-US') {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  return new Date(date).toLocaleDateString(locale, options);
}
