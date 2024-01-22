import React from 'react';
import Form from '../components/create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/tbot-fee/components/create-form';
import { Update, updateById } from '../fetcher';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

const FaqCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (formValues: FormValues) => {
    const _requestData: Update = {
      id: id as string,
      name: 'DEFAULT',
      data: {
        ranges: formValues.ranges,
      },
    };
    updateById(_requestData, id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update successfully');
        }
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to update data');
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle
        title="Edit bot fee"
        previousPath={ROUTERS.AFFILIATE_TBOT_FEE}
      />
      <Form handleSubmit={handleSubmit} create={false} />
    </>
  );
};

export default FaqCreatePage;
