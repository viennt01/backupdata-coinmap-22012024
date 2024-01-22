import { post, get, put, deleteGW } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response, ResponseWithoutPayload } from 'fetcher/interface';
import { format } from 'date-fns';
import {
  BotListPayload,
  CreateBotAsset,
  DeleteBotAsset,
  Role,
} from './interface';
import {
  normalizeFeature,
  RawFeature,
} from 'components/settings/feature/fetcher';
import { Feature } from 'components/settings/feature/interface';
import {
  normalizeGeneral,
  RawGeneral,
} from 'components/settings/general/fetcher';
import {
  normalizeExchange,
  RawExchange,
} from 'components/settings/exchange/fetcher';
import { normalizeSymbol, RawSymbol } from 'components/settings/symbol/fetcher';
import {
  normalizeResolution,
  RawResolution,
} from 'components/settings/resolution/fetcher';

export interface RawRole {
  id: string;
  role_name: string;
  description: string;
  owner_created: string;
  created_at: string;
  updated_at: string;
  root: {
    features: RawFeature[];
    general_settings: RawGeneral[];
    symbol_settings_roles: {
      id: string;
      description: string;
      exchanges: RawExchange[];
      resolutions: RawResolution[];
      symbols: RawSymbol[];
    }[];
  };
  status: string;
  type: string;
  price: string;
  currency: string;
  parent_id?: string;
  is_best_choice?: boolean;
  order?: number;
  description_features: {
    features: string[];
  };
  color?: string;
  expires_at?: number;
}

export interface RawRoleCreate {
  role_name: string;
  description: string;
  type: string;
  price: string;
  currency: string;
  parent_id?: string;
  is_best_choice?: boolean;
  order?: number;
  description_features: string[];
  status: string;
  color?: string;
}
export interface RawRoleUpdate {
  role_name?: string;
  description?: string;
  type?: string;
  price?: string;
  currency?: string;
  status?: string;
  parent_id?: string;
  is_best_choice?: boolean;
  order?: number;
  description_features?: string[];
  color?: string;
}
export interface RawRoleOrderUpdate {
  roles: { id: string; order: number }[];
}

export interface RawRoleFeatureCreate {
  features: {
    feature_id: RawFeature['feature_id'];
    description: RawFeature['description'];
  }[];
}

export interface RawRoleGeneralCreate {
  general_settings: {
    general_setting_id: RawGeneral['general_setting_id'];
    description: RawGeneral['description'];
    val_limit: number;
  }[];
}

export interface RawRoleSymbolCreate {
  list_symbol: RawSymbol['symbol'][];
  list_exchanged: RawExchange['exchange_name'][];
  supported_resolutions: RawResolution['id'][];
  description: string;
}

export const createRole = (data: RawRoleCreate) => {
  return post<RawRoleCreate, Response<RawRole[]>>({ data })(
    API_ADMIN.ROLE_CREATE,
  );
};

export const createFeatureRole = (
  data: RawRoleFeatureCreate,
  roleId: RawRole['id'],
) => {
  return put<RawRoleFeatureCreate, Response<Role[]>>({ data })(
    `${API_ADMIN.ROLE_FEATURE_CREATE}/${roleId}`,
  );
};

export const createGeneralRole = (
  data: RawRoleGeneralCreate,
  roleId: RawRole['id'],
) => {
  return put<RawRoleGeneralCreate, Response<Role[]>>({ data })(
    `${API_ADMIN.ROLE_GENERAL_CREATE}/${roleId}`,
  );
};

export const createSymbolRole = (
  data: RawRoleSymbolCreate,
  roleId: RawRole['id'],
) => {
  return put<RawRoleSymbolCreate, Response<Role[]>>({ data })(
    `${API_ADMIN.ROLE_SYMBOL_CREATE}/${roleId}`,
  );
};

export const normalizeRole = (roles: RawRole[]): Role[] => {
  return roles.map((r, index) => ({
    id: r.id,
    roleName: r.role_name,
    root: {
      features: normalizeFeature(r.root.features || []),
      generalSettings: normalizeGeneral(r.root.general_settings || []),
      symbolSettingsRoles: (r.root.symbol_settings_roles || []).map((ssr) => ({
        id: ssr.id,
        description: ssr.description,
        exchanges: normalizeExchange(ssr.exchanges),
        resolutions: normalizeResolution(ssr.resolutions),
        symbols: normalizeSymbol(ssr.symbols),
      })),
    },
    description: r.description,
    ownerCreated: r.owner_created,
    updatedAt: format(Number(r.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(r.created_at), 'dd/MM/yyyy'),
    status: r.status,
    type: r.type,
    price: r.price,
    currency: r.currency,
    parentId: r.parent_id,
    isBestChoice: r.is_best_choice,
    order: index + 1,
    descriptionFeatures: r.description_features?.features || [],
    color: r.color,
    expiresAt: r.expires_at
      ? format(Number(r.expires_at), 'HH:mm dd/MM/yyyy')
      : 'Unlimited',
  }));
};

export const getRoles = () => {
  return get<Response<RawRole[]>>({})(API_ADMIN.USER_ROLE_LISTING);
};

export const deleteRole = (id: RawRole['id']) => {
  return deleteGW<{ id: RawRole['id'] }, Response<Feature[]>>({ data: { id } })(
    `${API_ADMIN.ROLE_DELETE}/${id}`,
  );
};

export const getRole = (roleId: RawRole['id']) => {
  return get<Response<RawRole>>({})(`${API_ADMIN.ROLE_DETAIL}/${roleId}`);
};

export const updateRole = (role: RawRoleUpdate, roleId: RawRole['id']) => {
  return put<RawRoleUpdate, Response<RawRole[]>>({ data: role })(
    `${API_ADMIN.ROLE_EDITING}/${roleId}`,
  );
};
export const updateOrderRole = (data: RawRoleOrderUpdate) => {
  return put<RawRoleOrderUpdate, Response<RawRole[]>>({ data: data })(
    `${API_ADMIN.ROLE_EDITING}/order`,
  );
};
export const getSbot = (sbotId: BotListPayload['id']) => {
  return get<Response<BotListPayload[]>>({})(
    `${API_ADMIN.LIST_HISTORY_SBOT}/${sbotId}/sbot`,
  );
};
export const getTbot = (sbotId: BotListPayload['id']) => {
  return get<Response<BotListPayload[]>>({})(
    `${API_ADMIN.LIST_HISTORY_SBOT}/${sbotId}/tbot`,
  );
};

export const getRolePKGBot = (roleId: RawRole['id']) => {
  return get<Response<RawRole[]>>({})(
    `${API_ADMIN.USER_EDITING}/${roleId}/role`,
  );
};

export const createBotAsset = (data: CreateBotAsset) => {
  return put<CreateBotAsset, Response<ResponseWithoutPayload>>({ data })(
    API_ADMIN.BOT_ASSET_CREATE,
  );
};

export const deleteBotAsset = (data: DeleteBotAsset) => {
  return put<DeleteBotAsset, Response<ResponseWithoutPayload>>({ data })(
    API_ADMIN.BOT_ASSET_DELETE,
  );
};
