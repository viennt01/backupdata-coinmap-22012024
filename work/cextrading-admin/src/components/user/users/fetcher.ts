import { get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';
import { convertToParamsString } from 'fetcher/utils';
import {
  USER_TYPE,
  ResponseUserList,
  UserList,
  User,
  UserExport,
  USER_ACTIVE,
  CONFIRM_EMAIL,
} from './interface';
import { RawRole, normalizeRole } from 'components/user/role/fetcher';

export interface RawUserList {
  active: boolean;
  address: string;
  affiliate_code: string;
  created_at: string;
  email: string;
  email_confirmed: false;
  first_name: string;
  id: string;
  is_admin: boolean;
  last_name: string;
  link_affiliate: string;
  note_updated: string;
  phone: string;
  profile_pic: string;
  referral_code: string;
  super_user: false;
  updated_at: string;
  username?: string;
  date_registered?: string;
  roles: string[];
  log_roles: string[];
}
export interface RawUser {
  active: boolean;
  address: string;
  affiliate_code: string;
  created_at: string;
  email: string;
  email_confirmed: false;
  first_name: string;
  id: string;
  is_admin: boolean;
  last_name: string;
  link_affiliate: string;
  note_updated: string;
  phone: string;
  profile_pic: string;
  referral_code: string;
  super_user: false;
  updated_at: string;
  username?: string;
  date_registered?: string;
  roles: RawRole[];
}

interface RawResponseUserList {
  rows: RawUserList[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface RawUserCreate {
  phone: string;
  first_name: string;
  last_name: string;
  address: string;
  affiliate_code: string;
  link_affiliate: string;
  referral_code: string;
  profile_pic: string;
  note_updated: string;
  active: boolean;
  is_admin: boolean;
  email: string;
}

export interface ParamUserList {
  page: number;
  size: number;
  keyword?: string;
  user_type: USER_TYPE;
  roles?: string;
}

export interface RawRoleUpdateUser {
  role_id: RawRole['id'];
  description: RawRole['description'];
}

export interface RawUserRole {
  user_id: RawUserList['id'];
  roles: RawRoleUpdateUser[];
}

export interface AddMultipleUserRole {
  user_ids: string[];
  role_ids: string[];
  quantity?: number;
  type?: string;
}
export interface RemoveMultipleUserRole {
  user_ids: string[];
  role_ids: string[];
}

export const createUser = (data: RawUserCreate) => {
  return post<RawUserCreate, Response<RawUserList>>({ data })(
    API_ADMIN.USER_CREATE,
  );
};

// export const createFeatureRole = (data: RawRoleFeatureCreate, roleId: RawRole['id']) => {
//   return put<RawRoleFeatureCreate, Response<Role[]>>({ data })(`${API_ADMIN.ROLE_FEATURE_CREATE}/${roleId}`);
// };

export const normalizeUser = (
  rawUserList: RawUser,
  checked?: boolean,
): User => {
  const user: User = {
    active: rawUserList.active,
    address: rawUserList.address,
    affiliateCode: rawUserList.affiliate_code,
    email: rawUserList.email,
    emailConfirmed: rawUserList.email_confirmed,
    firstName: rawUserList.first_name,
    lastName: rawUserList.last_name,
    id: rawUserList.id,
    isAdmin: rawUserList.is_admin,
    linkAffiliate: rawUserList.link_affiliate,
    noteUpdated: rawUserList.note_updated,
    phone: rawUserList.phone,
    profilePic: rawUserList.profile_pic,
    referralCode: rawUserList.referral_code,
    superUser: rawUserList.super_user,
    username: rawUserList.username,
    dateRegistered: rawUserList.date_registered,
    updatedAt: format(Number(rawUserList.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(rawUserList.created_at), 'dd/MM/yyyy'),
    roles: rawUserList.roles ? normalizeRole(rawUserList.roles) : [],
    checked: checked,
  };

  return user;
};
export const normalizeListingUser = (
  rawUserList: RawUserList,
  checked?: boolean,
): UserList => {
  const user: UserList = {
    active: rawUserList.active,
    address: rawUserList.address,
    affiliateCode: rawUserList.affiliate_code,
    email: rawUserList.email,
    emailConfirmed: rawUserList.email_confirmed,
    firstName: rawUserList.first_name,
    lastName: rawUserList.last_name,
    id: rawUserList.id,
    isAdmin: rawUserList.is_admin,
    linkAffiliate: rawUserList.link_affiliate,
    noteUpdated: rawUserList.note_updated,
    phone: rawUserList.phone,
    profilePic: rawUserList.profile_pic,
    referralCode: rawUserList.referral_code,
    superUser: rawUserList.super_user,
    username: rawUserList.username,
    dateRegistered: rawUserList.date_registered,
    updatedAt: format(Number(rawUserList.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(rawUserList.created_at), 'dd/MM/yyyy'),
    roles:
      Array.from(
        new Set((rawUserList.roles || []).concat(rawUserList.log_roles || [])),
      ) || [],
    checked: checked,
  };

  return user;
};

export const normalizeExportUser = (rawUserList: RawUserList): UserExport => {
  const user: UserExport = {
    id: rawUserList.id,
    fullname: `${rawUserList.last_name} ${rawUserList.first_name}`,
    email: rawUserList.email,
    phone: rawUserList.phone ? `'${rawUserList.phone}` : '',
    address: rawUserList.address,
    roles: rawUserList.roles.join('; '),
    active: rawUserList.active ? USER_ACTIVE.ACTIVE : USER_ACTIVE.DEACTIVE,
    emailConfirmed: rawUserList.email_confirmed
      ? CONFIRM_EMAIL.YES
      : CONFIRM_EMAIL.NO,
    createdAt: `'${format(Number(rawUserList.created_at), 'HH:mm dd/MM/yyyy')}`,
  };

  return user;
};

export const normalizeUserList = (
  responseUserList: RawResponseUserList,
  userSelected: { value: string; label: string }[],
): ResponseUserList => {
  const rows: UserList[] = responseUserList.rows.map((r) => {
    const checked = userSelected.find((u) => u.value === r.id) ? true : false;
    return normalizeListingUser(r, checked);
  });
  return {
    rows,
    page: responseUserList.page,
    size: responseUserList.size,
    count: responseUserList.count,
    total: responseUserList.total,
  };
};
// export const normalizeGetUser = (
//   responseUserList: RawResponseUserList,
//   userSelected: { value: string; label: string }[],
// ): ResponseUserList => {
//   const rows: User[] = responseUserList.rows.map((r) => {
//     const checked = userSelected.find((u) => u.value === r.id) ? true : false;
//     return normalizeUser(r, checked);
//   });
//   return {
//     rows,
//     page: responseUserList.page,
//     size: responseUserList.size,
//     count: responseUserList.count,
//     total: responseUserList.total,
//   };
// };

export const getUsers = (params: ParamUserList) => {
  const paramsString = convertToParamsString<ParamUserList>(params);
  return get<Response<RawResponseUserList>>({})(
    API_ADMIN.USER_LISTING + '?' + paramsString,
  );
};

export const getAllUsers = (params: { keyword?: string }) => {
  const paramsString = convertToParamsString<ParamUserList>(params);
  return get<Response<RawUserList[]>>({})(
    API_ADMIN.USER_LISTING_ALL + '?' + paramsString,
  );
};

export const getUser = (userId: RawUser['id']) => {
  return get<Response<RawUser>>({})(`${API_ADMIN.USER_DETAIL}/${userId}`);
};

export const getRoleByUser = (userId: RawUserList['id']) => {
  const paramsString = convertToParamsString<{ user_id: RawUserList['id'] }>({
    user_id: userId,
  });
  return get<Response<RawRole[]>>({})(
    API_ADMIN.USER_ROLE_BY_USERID + '?' + paramsString,
  );
};

// export const deleteRole = (id: RawRole['id']) => {
//   return deleteGW<{ id: RawRole['id'] }, Response<Feature[]>>({ data: { id } })(`${API_ADMIN.ROLE_DELETE}/${id}`);
// };

// export const getRole = (roleId: RawRole['id']) => {
//   return get<Response<RawRole>>({})(`${API_ADMIN.ROLE_DETAIL}/${roleId}`);
// };

export const updateUser = (
  user: Omit<RawUserCreate, 'email'>,
  userId: RawUserList['id'],
) => {
  return put<Omit<RawUserCreate, 'email'>, Response<RawUserList>>({
    data: user,
  })(`${API_ADMIN.USER_EDITING}/${userId}`);
};

export const addRoleToUser = (data: RawUserRole) => {
  return put<RawUserRole, Response<RawUserList>>({ data: data })(
    `${API_ADMIN.USER_ROLE}`,
  );
};

export const addMultipleRoleToUser = (data: AddMultipleUserRole) => {
  return put<AddMultipleUserRole, Response<boolean>>({ data: data })(
    `${API_ADMIN.USER_ROLE_ADD_MULTIPLE}`,
  );
};
export const removeMultipleRoleToUser = (data: RemoveMultipleUserRole) => {
  return put<AddMultipleUserRole, Response<boolean>>({ data: data })(
    `${API_ADMIN.USER_ROLE_REMOVE_MULTIPLE}`,
  );
};
export interface Transaction {
  rows: any;
  id: string;
  order_id: string;
  asset_id: string;
  package_type: string;
  category: string;
  quantity: number;
  expires_at: number;
  status: string;
  name: string;
  price: string;
  discount_rate: number;
  discount_amount: number;
  created_at: number;
  updated_at: number;
}

export const getTransactionDetail = (id: string, nameHistory: string) => {
  return get<Response<Transaction>>({})(
    API_ADMIN.LIST_HISTORY_BOT_PKG +
      '/' +
      id +
      '/' +
      'asset?category=' +
      nameHistory,
  );
};
