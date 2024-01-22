import React from 'react';
import Form from '../components/create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/tbot-fee/components/create-form';
import { createNew, Create } from '../fetcher';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

const FaqCreatePage = () => {
  const router = useRouter();
  const handleSubmit = (formValues: FormValues) => {
    const _requestData: Create = {
      name: 'DEFAULT',
      data: {
        ranges: formValues.ranges,
      },
    };

    createNew(_requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Create successfully');
          return router.push(ROUTERS.AFFILIATE_TBOT_FEE);
        }
      })
      .catch((e: Error) => {
        errorToast(
          JSON.parse(e.message)?.message || 'Failed to create bot fee'
        );
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle
        title="Create new bot fee"
        previousPath={ROUTERS.AFFILIATE_TBOT_FEE}
      />
      <Form create handleSubmit={handleSubmit} />
    </>
  );
};

export default FaqCreatePage;
