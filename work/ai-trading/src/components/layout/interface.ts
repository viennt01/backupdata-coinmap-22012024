export enum DomainTypes {
  COINMAP = 'COINMAP',
  OTHERS = 'OTHERS',
}

export enum AppTemplate {
  AI_TRADING = 'AI_TRADING',
  ATM = 'ATM',
}

export interface AppTheme {
  template: AppTemplate;
  colors: {
    // surface colors
    primary: string;
    secondary: string;
    secondary_lighten_1: string;
    secondary_lighten_2: string;
    secondary_darken_1: string;
    secondary_darken_2: string;
    // text colors
    on_primary: string;
    on_secondary: string;
    on_secondary_lighten_1: string;
    on_secondary_lighten_2: string;
    on_secondary_darken_1: string;
    on_secondary_darken_2: string;
    on_price: string;
  };
}

export interface Broker {
  name: string;
  code: string;
  selected: boolean;
  referral_setting: {
    [key: string]: string;
  };
}

export interface FAQ_Item {
  name: string;
  answer: string;
  order: number;
}
export interface FAQ {
  id: string;
  name: string;
  status: 'ON' | 'OFF';
  data: {
    translation: {
      en: FAQ_Item;
      vi: FAQ_Item;
    };
  };
}

export interface MerchantInfo {
  code: string;
  domain: string;
  config: {
    domain_type: DomainTypes;
    copyright: string;
    favicon_url: string;
    logo_url: string;
    footer_logo_url: string;
    banner_url_1: string;
    banner_url_2: string;
    social_media: {
      discord_url: string;
      facebook_url: string;
      telegram_url: string;
      twitter_url: string;
      youtube_url: string;
    };
    support: {
      email: string;
    };
    tracking_id: string;
    google_tag_manager_id: string;
    fbPixelId: string;
    policy_file: {
      url: string;
    };
    theme: AppTheme;
    brokers: Broker[];
    user_registration: boolean;
    hide_background_texture: boolean;
  };
  faq: FAQ[];
}

export interface UserProfile {
  name?: string;
  email?: string;
  profile_pic?: string;
  first_name?: string;
  last_name?: string;
  year_of_birth?: string;
  phone_code?: string;
  phone?: string;
  country?: string;
}
