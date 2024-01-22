import { FIELD_TYPE } from '@/constants/code-constants';

export enum BOT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum MERCHANT_BOT_STATUS {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export enum BOT_CATEGORY {
  TBOT = 'TBOT',
  SBOT = 'SBOT',
  PKG = 'PKG',
}

export enum TEMPLATE_TYPE {
  AI_TRADING = 'AI_TRADING',
  ATM = 'ATM',
}

export interface BOT {
  balance: string;
  code: string;
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  max_drawdown: string;
  name: string;
  clone_name?: string;
  order: number;
  owner_created: string;
  pnl: string;
  price: string;
  status: BOT_STATUS;
  token_first: string;
  token_second: string;
  type: string;
  updated_at: string;
  category: string;
  work_based_on: string;
}

export interface Merchant_BOT {
  id: string;
  merchant_id: string;
  asset_id: BOT['id'];
  category: BOT['category'];
  name: BOT['name'];
  pnl: BOT['pnl'];
  max_drawdown: BOT['max_drawdown'];
  price: BOT['price'];
  image_url: BOT['image_url'];
  order: BOT['order'];

  status: MERCHANT_BOT_STATUS;
  commission: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}

export interface FaqByMerchant {
  id: string;
  type: string;
  name: string;
  order: number;
  data: {
    answer: string;
  };
  status: string;
  merchant_id: string;
  additional_data_id: string;
}

export interface PackageByMerchant {
  id: string;
  type: string;
  name: string;
  data: {
    translate: {
      vi: {
        name: string;
        quantity: number;
        discount_amount: number;
        discount_rate: number;
        status: string;
        type: string;
      };
      en: {
        name: string;
        quantity: number;
        discount_amount: number;
        discount_rate: number;
        status: string;
        type: string;
      };
    };
  };
  status: string;
  merchant_id: string;
  additional_data_id: string;
}

export interface BrokerSetting {
  id: string;
  name: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Broker {
  code: string;
  name: string;
  required_profile: boolean;
  check_referral_broker: boolean;
  broker_timezone: string;
  broker_dst_switch_timezone: string;
  servers: string[];
  referral_setting: {
    name: string;
    key: string;
    type: FIELD_TYPE;
  }[];
}
