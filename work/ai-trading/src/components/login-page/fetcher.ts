import { get, post, ResponseWithPayload } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';
import { UserProfile } from '@/components/layout/interface';

export interface LoginData {
  email: string;
  password: string;
  m_affiliate?: string;
}

export const userLogin = (data: LoginData) => {
  return post<LoginData, ResponseWithPayload<{ token: string }>>({ data })(
    API_USER.LOGIN
  );
};

export const getUserProfile = (queryString?: string) => {
  return get<unknown, ResponseWithPayload<UserProfile>>({})(
    `${API_USER.PROFILE}?${queryString ?? ''}`
  );
};
