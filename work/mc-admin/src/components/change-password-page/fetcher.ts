import { put, ResponseWithPayload } from '@/fetcher';
import { API_MERCHANT } from '@/fetcher/endpoint';

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export const updatePassword = (data: ChangePasswordData) => {
  return put<ChangePasswordData, ResponseWithPayload<boolean>>({ data })(
    API_MERCHANT.CHANGE_PASSWORD
  );
};
