import RegisterPage from '@/components/RegisterPage';
import { Layout } from '@/components/Layout';
import useSWR from 'swr';
import { GATEWAY, get } from '@/fetcher';
import { ERROR_CODE } from '@/fetcher/utils';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

const Register = () => {
  const { data } = useSWR(
    `/user/app-setting/ON_OFF_REGISTER`,
    get({
      gw: GATEWAY.API_USER_ROLES_GW,
    }),
    {
      revalidateOnFocus: false,
    }
  );

  if (data && data.error_code === ERROR_CODE.SUCCESS) {
    if (data.payload.value === 'ON') {
      return <RegisterPage />;
    }
  }
  return <NotFoundPage />;
};

Register.Layout = Layout;

export default Register;
