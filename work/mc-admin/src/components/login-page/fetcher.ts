import { post, ResponseWithPayload } from '@/fetcher';
import { API_AUTHENTICATE } from '@/fetcher/endpoint';

export interface LoginData {
  email: string;
  password: string;
}

export const loginMerchant = (data: LoginData, queryString: string) => {
  return post<LoginData, ResponseWithPayload<string>>({ data })(
    API_AUTHENTICATE.LOGIN + queryString
  );
};
