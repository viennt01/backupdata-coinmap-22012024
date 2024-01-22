export enum PROFILE_TABS {
  PROFILE = 'profile',
  PLAN = 'plan',
  PAYMENT = 'payment',
}

enum ROUTERS {
  HOME = '/',
  DASHBOARD = '/dashboard',
  TRADING_BOT = '/trading-bot',
  MARKETPLACE = '/marketplace',
  PROFILE = '/profile?tab=profile',
  MY_PLAN = '/profile?tab=plan',
  MY_PAYMENT = '/profile?tab=payment',
  LOGIN = '/login',
  REGISTER = '/register',
  LOGOUT = '/logout',
  FORGOT_PASSWORD = '/forgot-password',
  RESET_PASSWORD = '/reset-password',
  FEATURES = '/#features',
  MARKET = '/#market',
  PRICING = '/#pricing',
  CONTACT = '/#contact',
  PRICING_CHECKOUT = '/pricing/payment/checkout',
}

export default ROUTERS;

export const PAGE_NO_NEED_AUTHORIZE = [
  '/',
  '/404',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];
