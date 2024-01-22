export enum PROFILE_TABS {
  PROFILE = 'profile',
  PLAN = 'plan',
  PAYMENT = 'payment',
}

enum ROUTERS {
  HOME = '/',
  ERROR = '/error',
  FEATURES = '/#features',
  MARKET = '/#market',
  PRICING = '/#pricing',
  CONTACT = '/#contact',
  DASHBOARD = '/dashboard',
  TRADING_BOT = '/trading-bot',
  PROFILE = '/profile?tab=profile',
  MY_PLAN = '/profile?tab=plan',
  MY_PAYMENT = '/profile?tab=payment',
  HELP = '/#help',
  POLICY = '/policy',
  LOGIN = '/login',
  REGISTER = '/register',
  LOGOUT = '/logout',
  MARKETPLACE = '/#marketplace',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  MARKETPLACE_PAGE = '/marketplace',
  PAYMENT = '/marketplace/payment',
  CHECKOUT = '/marketplace/payment/checkout',
}

export default ROUTERS;

export const PAGE_NO_NEED_AUTHORIZE = [
  '/home-default',
  '/home-algo-market',
  '/marketplace',
  '/404',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/_error',
];
