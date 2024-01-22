export enum DomainTypes {
  COINMAP = 'COINMAP',
  OTHERS = 'OTHERS',
}

export interface MerchantInfo {
  code: string;
  domain: string;
  config: {
    domain_type: DomainTypes;
    copyright: string;
    logo_url: string;
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
  };
}

export interface UserProfile {
  name: string;
  email: string;
  profile_pic: string;
  first_name: string;
  last_name: string;
  year_of_birth: string;
  phone: string;
  phone_code: string;
  country: string;
}
