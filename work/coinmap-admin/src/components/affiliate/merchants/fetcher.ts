import { deleteGW, get, post, put } from '@/fetcher';
import { API_APP_SETTING, API_BOT, API_MERCHANTS } from '@/fetcher/endpoint';
import { MERCHANTS_STATUS, PERMISSION_ACTIONS } from '@/constants/merchants';
import {
  BOT,
  BOT_CATEGORY,
  MERCHANT_BOT_STATUS,
  TEMPLATE_TYPE,
} from './interface';
import { APP_SETTING_NAME } from '../interface';
import { FIELD_TYPE } from '@/constants/code-constants';

interface Broker {
  name: string;
  code: string;
  selected: boolean;
  referral_setting: { [key: string]: FIELD_TYPE };
}

export interface MerchantCreate {
  name: string;
  code: string;
  email: string;
  status: MERCHANTS_STATUS;
  description: string;
  domain: string;
  config: {
    commission: number;
    favicon_url: string;
    logo_url: string;
    banner_url_1: string;
    banner_url_2: string;
    email_logo_url: string;
    email_banner_url: string;
    copyright: string;
    policy_file?: {
      name: string;
      url: string;
    };
    domain_type: string;
    theme: {
      template: TEMPLATE_TYPE;
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
    permission: {
      pages: { action: PERMISSION_ACTIONS; id: string; pathname: string }[];
      features: { action: PERMISSION_ACTIONS; id: string }[];
    };
    tracking_id: string;
    facebook_pixel_id: string;
    view_id: string;
    update_user_bot: boolean;
    create_user_merchant: boolean;
    user_registration: boolean;
    hide_background_texture: boolean;
    brokers: Broker[];
  };
}

export interface MerchantUpdate {
  id: string;
  name?: string;
  code?: string;
  email?: string;
  status?: MERCHANTS_STATUS;
  description?: string;
  domain?: string;
  config?: {
    commission?: number;
    favicon_url?: string;
    logo_url?: string;
    banner_url_1?: string;
    banner_url_2?: string;
    email_logo_url?: string;
    email_banner_url?: string;
    copyright?: string;
    policy_file?: {
      name: string;
      url: string;
    };
    domain_type?: string;
    theme?: {
      template: TEMPLATE_TYPE;
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
    support?: {
      phone?: string;
      email?: string;
      telegram?: string;
      discord?: string;
    };
    social_media?: {
      facebook_url?: string;
      twitter_url?: string;
      telegram_url?: string;
      youtube_url?: string;
      discord_url?: string;
    };
    permission?: {
      pages?: { action: PERMISSION_ACTIONS; id: string; pathname: string }[];
      features?: { action: PERMISSION_ACTIONS; id: string }[];
    };
    tracking_id?: string;
    facebook_pixel_id: string;
    view_id?: string;
    update_user_bot?: boolean;
    create_user_merchant?: boolean;
    user_registration?: boolean;
    hide_background_texture?: boolean;
    brokers?: Broker[];
  };
}

export interface Merchant extends MerchantCreate {
  id: string;
  created_at: string;
  updated_at: string;
}

export interface MerchantBOTUpdate {
  category: BOT_CATEGORY;
  data: {
    id?: string;
    asset_id: BOT['id'];
    commission: number;
    status: MERCHANT_BOT_STATUS;
  };
}

export const getMerchants = () => {
  return get<Merchant[]>({})(API_MERCHANTS.LIST);
};

export const createMerchant = (data: MerchantCreate) => {
  return post<MerchantCreate>({ data })(API_MERCHANTS.CREATE);
};

export const getMerchantDetail = (id: string) => {
  return get<MerchantCreate>({})(`${API_MERCHANTS.CREATE}/${id}`);
};

export const ACTION_UPLOAD = process.env.API_MAIN_GW + '/upload';

export const updateMerchant = (data: MerchantUpdate, id: string) => {
  return put<MerchantUpdate>({ data })(`${API_MERCHANTS.CREATE}/${id}`);
};

export const resetMerchantPassword = (id: string) => {
  return put<undefined>({})(`${API_MERCHANTS.CREATE}/${id}/reset-password`);
};

export const updateMerchantBot = (data: MerchantBOTUpdate, id: string) => {
  return put<MerchantBOTUpdate>({
    data,
  })(`${API_MERCHANTS.UPDATE_BOTS(id)}`);
};

export const getListBots = () => {
  return get<BOT[]>({})(`${API_BOT.LIST}`);
};

export const getListMerchantBots = (merchantId: string) => {
  return get<BOT[]>({})(`${API_MERCHANTS.LIST_BOT(merchantId)}`);
};

export const deleteMerchantBots = (id: string) => {
  return deleteGW<unknown>({})(`${API_MERCHANTS.DELETE_BOT(id)}`);
};

export interface FormAdditionalData {
  id?: string;
  additional_data_id: string;
  order: number;
  status: 'ON' | 'OFF';
}

export const updateAdditionalData = (
  data: FormAdditionalData[],
  id: string
) => {
  return put<{ data: FormAdditionalData[] }>({
    data: {
      data: data,
    },
  })(`${API_MERCHANTS.UPDATE_FAQ_MERCHANT(id)}`);
};

export const getAdditionalDataMerchant = (id: string) => {
  return get({})(`${API_MERCHANTS.GET_ADDITIONAL_DATA_MERCHANT(id)}`);
};

export const getBrokerSettings = () => {
  const params = `name=${APP_SETTING_NAME.BROKER_SETTING}`;
  return get({})(`${API_APP_SETTING.LIST}?${params}`);
};
