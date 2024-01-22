import { ADDITIONAL_DATA_TYPE } from '@/fetcher/endpoint';

export interface Currency {
  created_at: string;
  currency: string;
  description: string;
  id: string;
  image_url: string;
  name: string;
  order: number;
  owner_created: string;
  status: boolean;
  type: string;
  updated_at: string;
}

export interface Package {
  created_at: string;
  discount_amount: number;
  discount_rate: number;
  id: string;
  name: string;
  owner_created: string;
  quantity: number;
  status: true;
  type: string;
  updated_at: string;
  order: number;
}

export interface BalanceRange {
  id: string;
  from: number;
  to: number;
  percent: number;
}

export interface BalanceRangeList {
  data: {
    ranges: BalanceRange[];
  };
}

export interface PackageLocale {
  id: string;
  data: {
    translation: {
      [key: string]: Package;
    };
  };
}

export interface PackageLocale {
  id: string;
  data: {
    translation: {
      [key: string]: Package;
    };
  };
}

export interface AdditionalData {
  id: string;
  created_by: string;
  updated_by: string;
  type: ADDITIONAL_DATA_TYPE;
  name: string;
  data: PaymentPolicy;
}

export interface PaymentPolicy {
  [key: string]: {
    payment_policy: {
      content: string;
    };
  };
}

export interface Role {
  category: string;
  color: string;
  created_at: string;
  currency: string;
  description: string;
  id: string;
  is_best_choice: boolean;
  order: number;
  owner_created: string;
  price: string;
  role_name: string;
  status: string;
  type: string;
  updated_at: string;
  description_features: {
    features: string[];
  };

  name?: string;
  image_url?: string;
}

export interface CreateTransaction {
  payment_method: string;
  items: {
    id: string;
    quantity: number;
    type: string;
    category: string;
  }[];
  amount: string;
  currency: string;
}

export interface GetBotPrice {
  balance: number;
  bot_id: string;
}

export interface BotPrice {
  price: number;
  total_price: number;
}
