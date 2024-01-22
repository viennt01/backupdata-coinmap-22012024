import React from 'react';
import FaqForm from '../components/faq-create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/faq/components/faq-create-form';
import { FaqUpdate, updateFaqById } from '../fetcher';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

const FaqCreatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const handleSubmit = (formValues: FormValues) => {
    const _requestData: FaqUpdate = {
      id: id as string,
      name: formValues.question,
      data: {
        translation: {
          en: {
            name: formValues.question,
            answer: formValues.answer,
          },
          vi: {
            name: formValues.question_vi,
            answer: formValues.answer_vi,
          },
        },
      },
    };
    updateFaqById(_requestData, id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update bots successfully');
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
        title="Edit Frequently Asked Questions"
        previousPath={ROUTERS.AFFILIATE_FAQ}
      />
      <FaqForm handleSubmit={handleSubmit} create={false} />
    </>
  );
};

export default FaqCreatePage;
