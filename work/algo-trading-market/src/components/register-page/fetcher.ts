import { post, ResponseWithPayload } from '@/fetcher';
import { API_USER } from '@/fetcher/endpoint';

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export const userRegister = (data: RegisterData) => {
  return post<RegisterData, ResponseWithPayload<boolean>>({
    data,
  })(API_USER.REGISTER);
};
