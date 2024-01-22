import React from 'react';
import Form from '../components/create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/package-period/components/create-form';
import { Update, updateById } from '../fetcher';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

const FaqCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (formValues: FormValues) => {
    const _requestData: Update = {
      id: id as string,
      name: formValues.name,
      data: {
        translation: {
          en: {
            name: formValues.name,
            quantity: formValues.quantity,
            discount_amount: formValues.discount_amount,
            discount_rate: formValues.discount_rate,
            type: formValues.type,
            order: formValues.order,
          },
          vi: {
            name: formValues.name_vi,
            quantity: formValues.quantity,
            discount_amount: formValues.discount_amount,
            discount_rate: formValues.discount_rate,
            type: formValues.type,
            order: formValues.order,
          },
        },
      },
    };
    updateById(_requestData, id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update successfully');
        }
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to create guest');
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle
        title="Edit package period"
        previousPath={ROUTERS.AFFILIATE_PACKAGE_PERIOD}
      />
      <Form handleSubmit={handleSubmit} create={false} />
    </>
  );
};

export default FaqCreatePage;
