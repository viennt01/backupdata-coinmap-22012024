import React from 'react';
import Form from '../components/create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/package-period/components/create-form';
import { createNew, Create } from '../fetcher';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

const FaqCreatePage = () => {
  const router = useRouter();
  const handleSubmit = (formValues: FormValues) => {
    const _requestData: Create = {
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

    createNew(_requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Create successfully');
          return router.push(ROUTERS.AFFILIATE_PACKAGE_PERIOD);
        }
      })
      .catch((e: Error) => {
        errorToast(
          JSON.parse(e.message)?.message || 'Failed to create package'
        );
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle
        title="Create new package"
        previousPath={ROUTERS.AFFILIATE_PACKAGE_PERIOD}
      />
      <Form create handleSubmit={handleSubmit} />
    </>
  );
};

export default FaqCreatePage;
