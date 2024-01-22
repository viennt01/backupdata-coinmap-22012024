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
}

export interface BalanceRange {
  id: string;
  from: number;
  to: number;
  percent: number;
}

export interface Role {
  id: string;
  type: string;
  category: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
}

export interface CreateTransaction {
  payment_method: string;
  items: {
    id: string;
    quantity: number;
    type: string;
    category: string;
    balance: number;
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
