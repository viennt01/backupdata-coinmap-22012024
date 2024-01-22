import React from 'react';
import FaqForm from '../components/faq-create-form';
import PageTitle from '@/components/commons/page-title';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/affiliate/faq/components/faq-create-form';
import { useRouter } from 'next/router';
import { FaqCreate, createFaq } from '../fetcher';
import { ROUTERS } from '@/constants/router';

const FaqCreatePage = () => {
  const router = useRouter();
  const handleSubmit = (formValues: FormValues) => {
    const _requestData: FaqCreate = {
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

    createFaq(_requestData)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Create faq successfully');
          return router.push(ROUTERS.AFFILIATE_FAQ);
        }
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to create faq');
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle
        title="Create new Frequently Asked Questions"
        previousPath={ROUTERS.AFFILIATE_FAQ}
      />
      <FaqForm create handleSubmit={handleSubmit} />
    </>
  );
};

export default FaqCreatePage;
