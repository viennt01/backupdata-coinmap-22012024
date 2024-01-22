import { Role } from './role/interface';

export interface RawData {
  email: string;
  name: string;
}

export interface Admin {
  active: boolean;
  address: string;
  affiliateCode: string;
  createdAt: string;
  dateRegistered: string;
  email: string;
  emailConfirmed: boolean;
  firstName: string;
  id: string;
  isAdmin: boolean;
  lastName: string;
  linkAffiliate: string;
  noteUpdated: string;
  phone: string;
  profilePic: string;
  referralCode: string;
  superUser: boolean;
  updatedAt: string;
  username: string;
  authRoles: Role[];
}

export interface AdminList {
  active: boolean;
  address: string;
  affiliateCode: string;
  createdAt: string;
  dateRegistered: string;
  email: string;
  emailConfirmed: boolean;
  firstName: string;
  id: string;
  isAdmin: boolean;
  lastName: string;
  linkAffiliate: string;
  noteUpdated: string;
  phone: string;
  profilePic: string;
  referralCode: string;
  superUser: boolean;
  updatedAt: string;
  username: string;
  authRoles: string[];
}

export interface ResponseAdminsList {
  rows: AdminList[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export enum USER_TYPE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface FILTER {
  page: number;
  size: number;
  keyword?: string;
  userType: USER_TYPE;
}

export enum USER_ACTIVE {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

export interface AdminCreate {
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  affiliateCode: string;
  linkAffiliate: string;
  referralCode: string;
  profilePic: string;
  noteUpdated: string;
  active: boolean;
  isAdmin: boolean;
  email: string;
  roleIds: Role['id'][];
}
