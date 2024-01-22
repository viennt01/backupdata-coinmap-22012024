import { get, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';
import { User } from '../interface';

export interface UserList {
  rows: User[];
  page: number;
  size: number;
  count: number;
  total: number;
}

export const getUserList = (queryString: string) => {
  return get<undefined, ResponseWithPayload<UserList>>({})(
    API_MERCHANT.USER_LIST + queryString
  );
};
