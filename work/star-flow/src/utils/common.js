import { LAYERS_MAP } from '@/config/consts/layer';

export const isServer = () => typeof window === 'undefined';

export const checkIsHeatmap = (chartType) =>
  LAYERS_MAP.heatmap.id === chartType;

export const isFootprintChart = (chartType) =>
  LAYERS_MAP.orderflow.id === chartType;

// decode query when using encodeURIComponent
// url format: https://coinmap.tech?f%3Daffiliate%26code%3Dabcxyz
// query format: { f=affiliate&code=abc: ""}
export const decodeQueryString = (query) => {
  const strings = Object.keys(query)?.[0]?.split('&'); // ["f=affiliate", "code=abcxyz",...]
  if (!strings?.length) return {};
  return strings.reduce((result, item) => {
    const index = item.indexOf('=');
    const key = item.slice(0, index);
    const value = item.slice(index + 1);
    return Object.assign({ [key]: value }, result);
  }, {});
};

export const generateAffiliateQuery = (code, domainType) => {
  return {
    [`f=affiliate&code=${code}&domain_type=${domainType}`]: '',
  };
};
