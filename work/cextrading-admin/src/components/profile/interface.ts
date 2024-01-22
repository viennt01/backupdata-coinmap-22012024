import { Role } from 'components/user/role/interface';

export enum USER_TYPE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface FILTER {
  page: number;
  side: number;
  keyword?: string;
  userType: USER_TYPE;
}

export enum USER_ACTIVE {
  ACTIVE = 'ACTIVE',
  DEACTIVE = 'DEACTIVE',
}

export interface UserList {
  active: boolean;
  address: string;
  affiliateCode: string;
  createdAt: string;
  email: string;
  emailConfirmed: false;
  firstName: string;
  id: string;
  isAdmin: boolean;
  lastName: string;
  linkAffiliate: string;
  noteUpdated: string;
  phone: string;
  profilePic: string;
  referralCode: string;
  superUser: false;
  updatedAt: string;
  username?: string;
  dateRegistered?: string;
  roles: Role[];
}

export interface ResponseUserList {
  rows: UserList[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export interface UserCreate {
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
