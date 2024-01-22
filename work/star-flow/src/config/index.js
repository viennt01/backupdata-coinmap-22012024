export const APP_NAME = process.env.APP_NAME || 'CexTrading.io';

export const URLS = {
  API_URL: process.env.API_URL,
  API_BINANCE: process.env.API_BINANCE,
  API_MAIN_GW: process.env.API_MAIN_GW,
  API_HEATMAP_GW: process.env.API_HEATMAP_GW,
  WS_HEATMAP: process.env.WS_HEATMAP,
  TRADINGVIEW_URL: process.env.TRADINGVIEW_URL,
  API_USER_ROLES_GW: process.env.API_USER_ROLES_GW,
  API_USER_ROLES_GW_V2: process.env.API_USER_ROLES_GW_V2,
  API_USER_ROLES_GW_V2: process.env.API_USER_ROLES_GW_V2,
  BOT_COINMAP_GW: process.env.BOT_COINMAP_GW,
  WS_WATCH_LIST: process.env.WS_WATCH_LIST,
  WS_STREAM_DATA: process.env.WS_STREAM_DATA,
  CEX_LINK: process.env.CEX_LINK,
  WS_LIMIT_DEVICE: process.env.WS_LIMIT_DEVICE,
};

export const LOCAL_SETTINGS_CACHE_KEY = 'LOCAL_SETTINGS_CACHE_KEY';
export const LOCAL_CACHE_KEYS = {
  LOCAL_SETTINGS_CACHE_KEY,
  UI_HEADER: 'UI_HEADER',
  CM_TOKEN: 'CM_TOKEN',
  WARNING_CLOSE_CHART: 'WARNING_CLOSE_CHART',
  DASHBOARD_IMPORTANT_NOTI: 'DASHBOARD_IMPORTANT_NOTI',
  LOGIN_ID: '436bd62c-6b9f-4c3c-bdf9-77685fad7c27', // using to deactivate other tabs when login
  VERIFY_ID: '78fac6f7-5b7a-44f5-bca7-2a0d3a7b5749', // using to check login multiple tabs
  TOGGLE_INDICATOR_LIST: 'TOGGLE_INDICATOR_LIST',
  XCME_TYPE_DATA: 'XCME_TYPE_DATA',
};

export const EXTERNAL_URLS = {
  FEEDBACK_FORM:
    process.env.FEEDBACK_FORM ||
    'https://docs.google.com/forms/d/e/1FAIpQLSe2-Bvdah4wlK1et3JFbhfL9_HRC2HeJFgvC9OTf3Npr89YyQ/viewform?vc=0&c=0&w=1&flr=0',
};

export const FEATURES = {
  BOT_SIGNALS: !!process.env.BOT_SIGNALS,
};

export const DASHBOARD_CONFIG = {
  LIMIT_SECTION: 4,
  LIMIT_INDICATOR: 3,
};
