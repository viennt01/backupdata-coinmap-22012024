import { get, post, put } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';
import { format } from 'date-fns';
import { ResponseAdminsList, USER_TYPE, AdminList } from './interface';
import { convertToParamsString } from 'fetcher/utils';
import { RawRole } from './role/fetcher';

export interface RawAdmin {
  active: boolean;
  address: string;
  affiliate_code: string;
  created_at: string;
  date_registered: string;
  email: string;
  email_confirmed: boolean;
  first_name: string;
  id: string;
  is_admin: boolean;
  last_name: string;
  link_affiliate: string;
  note_updated: string;
  phone: string;
  profile_pic: string;
  referral_code: string;
  super_user: boolean;
  updated_at: string;
  username: string;
  auth_roles: RawRole[];
}

export interface RawAdminList {
  active: boolean;
  address: string;
  affiliate_code: string;
  created_at: string;
  date_registered: string;
  email: string;
  email_confirmed: boolean;
  first_name: string;
  id: string;
  is_admin: boolean;
  last_name: string;
  link_affiliate: string;
  note_updated: string;
  phone: string;
  profile_pic: string;
  referral_code: string;
  super_user: boolean;
  updated_at: string;
  username: string;
  auth_roles: string[];
}

export const normalizeAdminList = (
  responseAdminList: RawResponseAdminsList,
): ResponseAdminsList => {
  const rows: ResponseAdminsList['rows'] = responseAdminList.rows.map((r) =>
    normalizeAdmin(r),
  );

  return {
    rows: rows,
    page: responseAdminList.page,
    size: responseAdminList.size,
    count: responseAdminList.count,
    total: responseAdminList.total,
  };
};
export const normalizeAdmin = (rawAdminList: RawAdminList): AdminList => {
  const user: AdminList = {
    active: rawAdminList.active,
    address: rawAdminList.address,
    affiliateCode: rawAdminList.affiliate_code,
    email: rawAdminList.email,
    emailConfirmed: rawAdminList.email_confirmed,
    firstName: rawAdminList.first_name,
    lastName: rawAdminList.last_name,
    id: rawAdminList.id,
    isAdmin: rawAdminList.is_admin,
    linkAffiliate: rawAdminList.link_affiliate,
    noteUpdated: rawAdminList.note_updated,
    phone: rawAdminList.phone,
    profilePic: rawAdminList.profile_pic,
    referralCode: rawAdminList.referral_code,
    superUser: rawAdminList.super_user,
    username: rawAdminList.username,
    dateRegistered: rawAdminList.date_registered,
    updatedAt: format(Number(rawAdminList.updated_at), 'dd/MM/yyyy'),
    createdAt: format(Number(rawAdminList.created_at), 'dd/MM/yyyy'),
    authRoles: rawAdminList.auth_roles,
  };

  return user;
};

interface RawResponseAdminsList {
  rows: RawAdminList[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface ParamsAdminList {
  page: number;
  size: number;
  keyword?: string;
  user_type: USER_TYPE;
}

export interface RawAdminCreate {
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

export interface RawAdminRole {
  user_id: RawAdminList['id'];
  auth_roles: {
    auth_role_id: RawRole['id'];
    description: RawRole['description'];
  }[];
}

export const getAdmins = (params: ParamsAdminList) => {
  const paramsString = convertToParamsString<ParamsAdminList>(params);
  return get<Response<RawResponseAdminsList>>({})(
    API_ADMIN.ADMIN_LIST + '?' + paramsString,
  );
};

export const createAdmin = (data: RawAdminCreate) => {
  return post<RawAdminCreate, Response<RawAdminList>>({ data })(
    API_ADMIN.ADMIN_CREATE,
  );
};

export const getAdmin = (userId: RawAdminList['id']) => {
  return get<Response<RawAdminList>>({})(`${API_ADMIN.ADMIN_CREATE}/${userId}`);
};

export const updateAdmin = (
  user: Omit<RawAdminCreate, 'email'>,
  userId: RawAdminList['id'],
) => {
  return put<Omit<RawAdminCreate, 'email'>, Response<RawAdminList>>({
    data: user,
  })(`${API_ADMIN.ADMIN_EDITING}/${userId}`);
};

export const addRoleToAdmin = (data: RawAdminRole) => {
  return put<RawAdminRole, Response<any>>({ data: data })(
    `${API_ADMIN.ADMIN_ROLE}`,
  );
};

export const getRoleByAdmin = (userId: RawAdminList['id']) => {
  const paramsString = convertToParamsString<{ user_id: RawAdminList['id'] }>({
    user_id: userId,
  });
  return get<Response<RawRole[]>>({})(
    API_ADMIN.ADMIN_ROLE_BY_ADMINID + '?' + paramsString,
  );
};
