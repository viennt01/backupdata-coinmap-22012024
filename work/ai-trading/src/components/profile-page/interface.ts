export interface UserProfile {
  name?: string;
  email?: string;
  profile_pic?: string;
  first_name?: string;
  last_name?: string;
  year_of_birth?: string;
}

export interface BotPlan {
  image_url: string;
  name: string;
  expires_at: number;
  description: string;
  price: string;
  type: string;
  currency: string;
  quantity: number;
}

export enum PAYMENT_STATUS {
  PROCESSING = 'PROCESSING',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
}

export interface Payment {
  asset_id: string;
  category: string;
  created_at: string;
  discount_amount: number;
  discount_rate: number;
  expires_at: string;
  id: string;
  name: string;
  order_id: string;
  owner_created: string;
  package_type: string;
  price: string;
  quantity: string;
  status: PAYMENT_STATUS;
  updated_at: string;
  user_id: string;
}
