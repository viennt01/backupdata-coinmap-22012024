import React from 'react';
import Vien from '@/components/commons/events/event-form';
import PageTitle from '@/components/commons/page-title';
import CustomCard from '@/components/commons/custom-card';
import { createEvent, AdminCreateEventOutput } from '@/utils/api-getters';
import { ERROR_CODE } from '@/constants/code-constants';
import { useRouter } from 'next/router';
import { errorToast, successToast } from '@/hook/toast';
import { FormValues } from '@/components/commons/events/event-form';
import { ROUTERS } from '@/constants/router';

const EventsCreatePage = () => {
  const router = useRouter();

  // create new event
  const handleSubmit = (formValues: FormValues) => {
    const _requestData = {
      ...formValues,
      start_at: formValues.start_at.valueOf(),
      finish_at: formValues.finish_at.valueOf(),
      email_remind_at: formValues.email_remind_at?.valueOf(),
    };
    createEvent(_requestData)
      .then((res: AdminCreateEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Create event successfully');
          return router.push(ROUTERS.EVENTS);
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to create event');
        console.log(e);
      });
  };

  return (
    <>
      <PageTitle title="Create new event" previousPath={ROUTERS.EVENTS} />
      <CustomCard>
        <Vien create handleSubmit={handleSubmit} />
      </CustomCard>
    </>
  );
};

export default EventsCreatePage;
