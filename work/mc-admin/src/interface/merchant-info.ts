import { DOMAIN_TYPE } from '@/constant/merchant';
import { WALLET_STATUS } from '@/constant/payment';

export interface MerchantInfo {
  name: string;
  email: string;
  code: string;
  domain: string;
  status: string;
  config: {
    create_user_merchant: boolean;
    update_user_bot: boolean;
    commission: number;
    logo_url: string;
    footer_logo_url: string;
    favicon_url: string;
    banner_url_1: string;
    banner_url_2: string;
    home_path: string;
    copyright: string;
    policy_file?: {
      name: string;
      url: string;
    };
    hide_background_texture: boolean;
    domain_type: DOMAIN_TYPE;
    support: {
      phone: string;
      email: string;
      telegram: string;
      discord: string;
    };
    social_media: {
      facebook_url: string;
      twitter_url: string;
      telegram_url: string;
      youtube_url: string;
      discord_url: string;
    };
    facebook_pixel_id: string;
    google_tag_manager_id: string;
    email_logo_url: string;
    email_banner_url: string;
    email_sender: {
      city: string;
      address: string;
      country: string;
      nickname: string;
      reply_to: string;
      from_name: string;
      from_email: string;
    };
    verified_sender: boolean;
    wallet: {
      wallet_address: string;
      status: WALLET_STATUS;
    };
    theme: {
      colors: {
        primary: string;
        secondary: string;
        secondary_lighten_1: string;
        secondary_lighten_2: string;
        secondary_darken_1: string;
        secondary_darken_2: string;

        on_primary: string;
        on_price: string;
        on_secondary: string;
        on_secondary_lighten_1: string;
        on_secondary_lighten_2: string;
        on_secondary_darken_1: string;
        on_secondary_darken_2: string;
      };
    };
  };
}

export interface MerchantUpdate {
  config: {
    logo_url?: string;
    footer_logo_url?: string;
    favicon_url?: string;
    banner_url_1?: string;
    banner_url_2?: string;
    home_path?: string;
    copyright?: string;
    policy_file?: {
      name: string;
      url: string;
    } | null;
    hide_background_texture: boolean;
    support?: {
      phone: string;
      email: string;
      telegram: string;
      discord: string;
    };
    social_media?: {
      facebook_url: string;
      twitter_url: string;
      telegram_url: string;
      youtube_url: string;
      discord_url: string;
    };
    facebook_pixel_id?: string;
    google_tag_manager_id?: string;
  };
}
