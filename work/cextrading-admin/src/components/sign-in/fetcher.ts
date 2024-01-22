import { post } from 'fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { Response } from 'fetcher/interface';

export interface RawAdminLogin {
  email: string;
  password: string;
}

export const adminLogin = (data: RawAdminLogin) => {
  return post<RawAdminLogin, Response<{ token: string }>>({ data })(
    API_ADMIN.ADMIN_LOGIN,
  );
};
