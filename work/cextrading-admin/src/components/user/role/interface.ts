import { Feature } from 'components/settings/feature/interface';
import { General } from 'components/settings/general/interface';
import { Exchange } from 'components/settings/exchange/interface';
import { ISymbol } from 'components/settings/symbol/interface';
import { Resolution } from 'components/settings/resolution/interface';

export interface Permission {
  description: string;
  permissionId: string;
  permissionName: string;
}
export interface Role {
  id: string;
  roleName: string;
  description: string;
  ownerCreated: string;
  createdAt: string;
  updatedAt: string;
  root: {
    features: Feature[];
    generalSettings: General[];
    symbolSettingsRoles: {
      id: string;
      description: string;
      exchanges: Exchange[];
      resolutions: Resolution[];
      symbols: ISymbol[];
    }[];
  };
  status: string;
  type: string;
  price: string;
  currency: string;
  parentId?: string;
  isBestChoice?: boolean;
  order: number;
  descriptionFeatures: string[];
  color?: string;
  expiresAt?: string;
}
export interface CreateRole {
  roleName: string;
  description: string;
  featureIds: Feature['featureId'][];
  generalIds: General['generalSettingId'][];
  exchangeIds: Exchange['exchangeName'][];
  symbolIds: ISymbol['symbol'][];
  resolutionIds: Resolution['id'][];
  valueLimit: {
    value: string;
    id: General['generalSettingId'];
  }[];
  status: string;
  type: string;
  price: string;
  currency: string;
  parentId?: string;
  isBestChoice?: boolean;
  order?: number;
  descriptionFeatures: string[];
  color?: string;
}
export interface UpdateOrderRole {
  id: string;
  order: number;
}
export enum ROLE_STATUS {
  OPEN = 'OPEN',
  COMINGSOON = 'COMINGSOON',
  CLOSE = 'CLOSE',
}
export enum ROLE_TYPE {
  PACKAGE = 'PACKAGE',
  FEATURE = 'FEATURE',
  FREE = 'FREE',
  FREE_TRIAL = 'FREE_TRIAL',
  BEST_CHOICE = 'BEST_CHOICE',
}
export interface BotListAsset {
  payload: BotListPayload[];
  error_code: string;
  message: string;
}
export interface BotListPayload {
  id: string;
  name: string;
  type: string;
  description: string;
  status: string;
  price: string;
  currency: string;
  work_based_on: string[];
  image_url: string;
  created_at: string;
  updated_at: string;
  order: string;
  expires_at?: number;
  user_status: string;
}

export interface CreateBotAsset {
  user_id: string;
  category: string;
  asset_id: string;
  quantity: number;
  type: string;
}
export type DeleteBotAsset = Omit<CreateBotAsset, 'type' | 'quantity'>;
