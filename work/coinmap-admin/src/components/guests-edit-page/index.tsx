import React from 'react';
import GuestForm from '@/components/commons/guests/guest-form';
import PageTitle from '@/components/commons/page-title';
import CustomCard from '@/components/commons/custom-card';
import { useRouter } from 'next/router';
import QRCode from '@/components/commons/qr';
import { URLS } from '@/constants/urls';
import {
  updateGuest,
  AdminUpdateStatusInviteEventOutput,
} from '@/utils/api-getters';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/commons/guests/guest-form';
import { ROUTERS } from '@/constants/router';

const GuestsEditPage = () => {
  const router = useRouter();

  // update guest info
  const handleSubmit = (formValues: FormValues) => {
    const _requestData = {
      id: router.query.id as string,
      confirm_status: formValues.confirm_status,
      payment_status: formValues.payment_status,
      attend: formValues.attend,
      email: formValues.email,
    };
    updateGuest(_requestData)
      .then((res: AdminUpdateStatusInviteEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update guest successfully');
          return;
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to update guest');
        console.log(e);
      });
  };

  // TODO: handle delete guest
  const handleDelete = () => {
    console.log('handleDelete');
  };

  return (
    <>
      <PageTitle title="Edit guest" previousPath={ROUTERS.GUESTS} />
      <CustomCard>
        <CustomCard
          style={{
            width: 'fit-content',
            height: 'fit-content',
            margin: '0 auto 24px auto',
          }}
        >
          <QRCode
            data={URLS.CALLBACK_ATTEND_URL + `?token=${router.query.id}`}
            width={320}
            height={320}
            image="/images/coinmap-logo-border.svg"
            imageOptions={{ imageSize: 0.5, hideBackgroundDots: false }}
          />
        </CustomCard>
        <GuestForm
          create={false}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      </CustomCard>
    </>
  );
};

export default GuestsEditPage;
