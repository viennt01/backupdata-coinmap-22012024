import { post, ResponseWithPayload } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';
export interface ResetPasswordData {
  email: string;
}

export const requestResetPassword = (data: ResetPasswordData) => {
  return post<ResetPasswordData, ResponseWithPayload<boolean>>({ data })(
    API_USER.FORGOT_PASSWORD
  );
};
