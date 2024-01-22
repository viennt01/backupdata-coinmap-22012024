export interface MerchantUpdate {
  config: {
    // analytics
    facebook_pixel_id?: string;
    google_tag_manager_id?: string;
    // email sender
    email_logo_url?: string;
    email_banner_url?: string;
    // support
    support?: {
      phone: string;
      email: string;
      telegram: string;
      discord: string;
    };
    // social media
    social_media?: {
      facebook_url: string;
      twitter_url: string;
      telegram_url: string;
      youtube_url: string;
      discord_url: string;
    };
    // website
    favicon_url?: string;
    logo_url?: string;
    banner_url_1?: string;
    banner_url_2?: string;
    copyright?: string;
    policy_file?: {
      name: string;
      url: string;
    } | null;
    hide_background_texture?: boolean;
    // theme
    color_primary?: string;
    color_secondary?: string;
    color_secondary_lighten_1?: string;
    color_secondary_lighten_2?: string;
    color_secondary_darken_1?: string;
    color_secondary_darken_2?: string;
    color_on_primary?: string;
    color_on_secondary?: string;
    color_on_secondary_lighten_1?: string;
    color_on_secondary_lighten_2?: string;
    color_on_secondary_darken_1?: string;
    color_on_secondary_darken_2?: string;
    color_on_price?: string;
  };
}

export interface UpdateSenderData {
  email: string;
  name: string;
  country: string;
  city: string;
  address: string;
}

export interface VerifySenderData {
  url_verify: string;
}
