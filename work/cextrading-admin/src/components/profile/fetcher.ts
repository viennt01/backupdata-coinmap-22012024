import { RawAdminList } from 'components/admin/fetcher';
import { API_ADMIN } from 'fetcher/endpoint';
import { get, put } from 'fetcher/index';
import { Response } from 'fetcher/interface';

export interface AdminUpdate {
  phone?: string;
  first_name?: string;
  last_name?: string;
  address?: string;
  affiliate_code?: string;
  link_affiliate?: string;
  referral_code?: string;
  profile_pic?: string;
  note_updated?: string;
  password?: string;
  old_password?: string;
}

export const getUserProfile = () => {
  return get<Response<RawAdminList>>({})(`${API_ADMIN.ADMIN_PROFILE}`);
};

export const updateAdmin = (data: AdminUpdate) => {
  return put<AdminUpdate, Response<RawAdminList>>({ data })(
    `${API_ADMIN.ADMIN_UPDATE}`,
  );
};
