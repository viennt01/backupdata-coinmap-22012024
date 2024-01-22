import React from 'react';
import GuestForm from '@/components/commons/guests/guest-form';
import PageTitle from '@/components/commons/page-title';
import CustomCard from '@/components/commons/custom-card';
import { createGuest, AdminInviteEventOutput } from '@/utils/api-getters';
import { ERROR_CODE } from '@/constants/code-constants';
import { useRouter } from 'next/router';
import { errorToast, successToast } from '@/hook/toast';
import { URLS } from '@/constants/urls';
import { FormValues } from '@/components/commons/guests/guest-form';
import { ROUTERS } from '@/constants/router';
const GuestsCreatePage = () => {
  const router = useRouter();

  // create new guest
  const handleSubmit = (formValues: FormValues) => {
    const _requestData = {
      event_id: formValues.event_id,
      fullname: formValues.fullname,
      email: formValues.email ? formValues.email : null,
      phone: formValues.phone ? formValues.phone : null,
      type: formValues.type,
      confirm_status: formValues.confirm_status,
      payment_status: formValues.payment_status,
      telegram: formValues.telegram,
      callback_confirm_url: URLS.CALLBACK_CONFIRM_URL,
      callback_attend_url: URLS.CALLBACK_ATTEND_URL,
    };
    createGuest(_requestData)
      .then((res: AdminInviteEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Create guest successfully');
          return router.push(ROUTERS.GUESTS);
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to create guest');
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle title="Create new guest" previousPath={ROUTERS.GUESTS} />
      <CustomCard>
        <GuestForm create handleSubmit={handleSubmit} />
      </CustomCard>
    </>
  );
};

export default GuestsCreatePage;
