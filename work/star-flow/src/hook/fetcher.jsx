import { API_USER } from '@/fetcher/endpoint';
import { deleteGW, GATEWAY, get, post } from '@/fetcher';

export const getResolutionsList = () => {
  return get({ gw: GATEWAY.API_USER_ROLES_GW })(API_USER.RESOLUTIONS_LIST);
};

export const getListChart = () => {
  return get({
    gw: GATEWAY.API_MAIN_GW,
  })('/chart/list');
};

export const getChartDetail = (id) => {
  return get({
    gw: GATEWAY.API_MAIN_GW,
  })(`/chart/detail/${id}`);
};
export const deleteChart = (id) => {
  return deleteGW({
    gw: GATEWAY.API_MAIN_GW,
  })(`/chart/delete/${id}`);
};

export const createDefaultChart = ({ chart }) => {
  const data = {
    chartname: chart.symbolInfo.symbol,
    resolution: chart.symbolInfo.interval,
    symbol: chart.symbolInfo.symbol,
    content: JSON.stringify(chart),
    clientid: '',
  };
  return post({
    data,
    gw: GATEWAY.API_MAIN_GW,
  })(`/chart/create`);
};
