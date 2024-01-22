export enum MERCHANTS_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MERCHANTS_STATUS_COLOR {
  INACTIVE = 'error',
  ACTIVE = 'success',
}

export enum PAYMENTS_STATUS_COLOR {
  COMPLETED = 'success',
  WAITING_PAYMENT = 'processing',
  WALLET_INVALID = 'error',
}

export enum PERMISSION_ACTIONS {
  VIEW = 'view',
  UPDATE = 'update',
}

export enum DOMAIN_TYPE {
  COINMAP = 'COINMAP',
  OTHERS = 'OTHERS',
}

export enum QUICK_SELECTION {
  ALL = 'ALL',
  MERCHANT = 'MERCHANT',
  CUSTOM = 'CUSTOM',
}

export const ACTION_COLORS = {
  view: '#337AB7',
  update: '#F0AD4E',
};

export enum EMAIL_VERIFY_TAG_COLOR {
  true = 'success',
  false = 'error',
}

export enum EMAIL_CONFIRMED_LABEL {
  true = 'YES',
  false = 'NO',
}

export const EMAIL_CONFIRMED = {
  TRUE: true,
  FALSE: false,
};

export const STRING_TO_BOOLEAN = {
  true: true,
  false: false,
};

export const PAGE_PERMISSIONS = [
  {
    id: 'PAGE_HOME',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/',
  },
  {
    id: 'PAGE_ABOUT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/about',
  },
  {
    id: 'PAGE_ECOSYSTEMS',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/ecosystems',
  },
  {
    id: 'PAGE_CONTACT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/contact',
  },
  {
    id: 'PAGE_HELP',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/help',
  },
  {
    id: 'PAGE_LOGIN',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/login',
  },
  {
    id: 'PAGE_REGISTER',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/register',
  },
  {
    id: 'PAGE_CONFIRM_EMAIL',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/confirm-email',
  },
  {
    id: 'PAGE_FORGOT_PASSWORD',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/forgot-password',
  },
  {
    id: 'PAGE_RESET_PASSWORD',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/reset-password',
  },
  {
    id: 'PAGE_PROFILE',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/profile',
  },
  {
    id: 'PAGE_CHART',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/chart',
  },
  {
    id: 'PAGE_SIGNAL_BOT_DASHBOARD',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/signal-bot-dashboard',
  },
  {
    id: 'PAGE_PRICING',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/pricing',
  },
  {
    id: 'PAGE_PRICING_PAYMENT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/pricing/payment',
  },
  {
    id: 'PAGE_PRICING_CHECKOUT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/pricing/payment/checkout',
  },
  {
    id: 'PAGE_PRICING_TIMEOUT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/pricing/payment/timeout',
  },
  {
    id: 'PAGE_MARKETPLACE',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/marketplace',
  },
  {
    id: 'PAGE_MARKETPLACE_PAYMENT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/marketplace/payment',
  },
  {
    id: 'PAGE_MARKETPLACE_CHECKOUT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/marketplace/payment/checkout',
  },
  {
    id: 'PAGE_MARKETPLACE_TIMEOUT',
    action: PERMISSION_ACTIONS.VIEW,
    pathname: '/marketplace/payment/timeout',
  },
];

export const FEATURE_PERMISSIONS = [
  {
    id: 'BOT_TRADING',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'BOT_SIGNAL',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'BUTTON_DASHBOARD',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'BUTTON_DASHBOARD_CEXTRADING',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'BUTTON_DASHBOARD_SIGNAL_BOT',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'BUTTON_DASHBOARD_TRADING_BOT',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'BUTTON_USER_GUIDE',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'SIDEBAR_COINMAP_SESSION',
    action: PERMISSION_ACTIONS.VIEW,
  },
  {
    id: 'HEADER_LOGO',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'FOOTER_LOGO',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'FOOTER_COPYRIGHT',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'MODAL_POLICY',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'SUPPORT_EMAIL',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'MEDIA_FACEBOOK',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'MEDIA_TWITTER',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'MEDIA_TELEGRAM',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'MEDIA_YOUTUBE',
    action: PERMISSION_ACTIONS.UPDATE,
  },
  {
    id: 'MEDIA_DISCORD',
    action: PERMISSION_ACTIONS.UPDATE,
  },
];

export const DEFAULT_PERMISSION_MERCHANT = {
  pages: [
    {
      id: 'PAGE_LOGIN',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/login',
    },
    {
      id: 'PAGE_REGISTER',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/register',
    },
    {
      id: 'PAGE_CONFIRM_EMAIL',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/confirm-email',
    },
    {
      id: 'PAGE_FORGOT_PASSWORD',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/forgot-password',
    },
    {
      id: 'PAGE_RESET_PASSWORD',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/reset-password',
    },
    {
      id: 'PAGE_PROFILE',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/profile',
    },
    {
      id: 'PAGE_MARKETPLACE',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/marketplace',
    },
    {
      id: 'PAGE_MARKETPLACE_PAYMENT',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/marketplace/payment',
    },
    {
      id: 'PAGE_MARKETPLACE_CHECKOUT',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/marketplace/payment/checkout',
    },
    {
      id: 'PAGE_MARKETPLACE_TIMEOUT',
      action: PERMISSION_ACTIONS.VIEW,
      pathname: '/marketplace/payment/timeout',
    },
  ],
  features: [
    {
      id: 'BOT_TRADING',
      action: PERMISSION_ACTIONS.VIEW,
    },
    {
      id: 'BUTTON_DASHBOARD',
      action: PERMISSION_ACTIONS.VIEW,
    },
    {
      id: 'BUTTON_DASHBOARD_TRADING_BOT',
      action: PERMISSION_ACTIONS.VIEW,
    },
    {
      id: 'HEADER_LOGO',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'FOOTER_LOGO',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'FOOTER_COPYRIGHT',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'MODAL_POLICY',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'SUPPORT_EMAIL',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'MEDIA_FACEBOOK',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'MEDIA_TWITTER',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'MEDIA_TELEGRAM',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'MEDIA_YOUTUBE',
      action: PERMISSION_ACTIONS.UPDATE,
    },
    {
      id: 'MEDIA_DISCORD',
      action: PERMISSION_ACTIONS.UPDATE,
    },
  ],
};

export const DEFAULT_PERMISSION_ALL = {
  pages: PAGE_PERMISSIONS,
  features: FEATURE_PERMISSIONS,
};

export const DEFAULT_PERMISSION_CUSTOM = {
  pages: [],
  features: [],
};
