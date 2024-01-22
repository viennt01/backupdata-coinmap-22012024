import React from 'react';
import Vien from '@/components/commons/events/event-form';
import PageTitle from '@/components/commons/page-title';
import CustomCard from '@/components/commons/custom-card';
import { updateEvent, AdminUpdateEventOutput } from '@/utils/api-getters';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { useRouter } from 'next/router';
import { FormValues } from '@/components/commons/events/event-form';
import { ROUTERS } from '@/constants/router';

const EventsEditPage = () => {
  const router = useRouter();

  // update event info
  const handleSubmit = (formValues: FormValues) => {
    const id = router.query.id as string;
    const _requestData = {
      ...formValues,
      start_at: formValues.start_at.valueOf(),
      finish_at: formValues.finish_at.valueOf(),
      email_remind_at: formValues.email_remind_at?.valueOf(),
    };
    updateEvent(id, _requestData)
      .then((res: AdminUpdateEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update event successfully');
          return;
        }
        errorToast(res.message);
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to update event');
        console.log(e);
      });
  };

  // TODO: handle delete event
  const handleDelete = () => {
    console.log('handleDelete');
  };

  return (
    <>
      <PageTitle title="Edit event" previousPath={ROUTERS.EVENTS} />
      <CustomCard>
        <Vien
          create={false}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
        />
      </CustomCard>
    </>
  );
};

export default EventsEditPage;
