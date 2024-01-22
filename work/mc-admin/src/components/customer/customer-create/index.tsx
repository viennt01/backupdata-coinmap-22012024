import CustomerCreateForm from '../components/customer-create-form';
import { FormValues } from '../components/customer-create-form';
import { createCustomer } from '../fetcher';
import { useRouter } from 'next/router';
import { ERROR_CODE } from '@/constant/error-code';
import { notification } from 'antd';
import { API_MESSAGE } from '@/constant/message';
import { UserCreate } from '../interface';
import { useContext, useEffect } from 'react';
import { AppContext } from '@/app-context';
import { ROUTERS } from '@/constant/router';

export default function CustomerCreate() {
  const router = useRouter();
  const [notiApi, contextHolder] = notification.useNotification();
  const { merchantInfo } = useContext(AppContext);

  const handleSubmit = (formValues: FormValues) => {
    const _requestData: UserCreate = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      password: formValues.password,
      gender: formValues.gender,
    };
    createCustomer(_requestData)
      .then((response) => {
        if (response.error_code === ERROR_CODE.SUCCESS) {
          return router.push(`/customer/list`);
        }
        notiApi.error({
          message: '',
          description: API_MESSAGE.ERROR,
          placement: 'topRight',
          duration: 3,
        });
      })
      .catch((e: Error) => {
        const res = JSON.parse(e.message);
        notiApi.error({
          message: '',
          description: res.message,
          placement: 'topRight',
          duration: 3,
        });
      });
  };

  useEffect(() => {
    if (merchantInfo && !merchantInfo.config.create_user_merchant) {
      router.replace(ROUTERS.CUSTOMER_LIST);
    }
  }, [merchantInfo]);

  return (
    <div>
      {contextHolder}
      <CustomerCreateForm handleSubmit={handleSubmit} />
    </div>
  );
}
