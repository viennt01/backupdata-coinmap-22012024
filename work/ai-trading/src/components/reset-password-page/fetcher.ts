import { post, ResponseWithPayload } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';
export interface ResetPasswordData {
  token: string;
  password: string;
}

export const resetPassword = (data: ResetPasswordData) => {
  return post<ResetPasswordData, ResponseWithPayload<boolean>>({ data })(
    API_USER.RESET_PASSWORD
  );
};
