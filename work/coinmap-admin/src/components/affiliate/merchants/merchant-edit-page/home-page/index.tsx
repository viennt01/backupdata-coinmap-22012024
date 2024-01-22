import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/commons/page-title';
import Segmented, { SEGMENTED } from '../segmented';
import ContentForm from '@/components/content-manager/home-page/components/content-form';
import {
  FormValues,
  HomePageContent,
} from '@/components/content-manager/home-page/interface';
import {
  getDefaultHomePageContent,
  getHomePageContent,
  updateHomePageContent,
} from './fetcher';
import { errorToast, successToast } from '@/hook/toast';
import { ERROR_CODE } from '@/constants/code-constants';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [homePageContent, setHomePageContent] = useState<HomePageContent>();
  const [defaultHomePageContent, setDefaultHomePageContent] =
    useState<HomePageContent>();

  const handleSubmit = (formValues: FormValues) => {
    setLoading(true);
    const merchantId = router.query.id as string;
    updateHomePageContent(merchantId, homePageContent?.id, formValues)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Update successfully');
        }
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to update data');
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  const fetchData = () => {
    setLoading(true);
    const merchantId = router.query.id as string;
    Promise.all([getDefaultHomePageContent(), getHomePageContent(merchantId)])
      .then(([defaultContentRes, contentRes]) => {
        if (
          defaultContentRes.error_code === ERROR_CODE.SUCCESS &&
          defaultContentRes.payload[0]
        ) {
          setDefaultHomePageContent(defaultContentRes.payload[0]);
        }

        if (
          contentRes.error_code === ERROR_CODE.SUCCESS &&
          contentRes.payload[0]
        ) {
          setHomePageContent(contentRes.payload[0]);
        }
      })
      .catch((e: Error) => {
        errorToast(JSON.parse(e.message)?.message || 'Failed to get data');
        console.log(e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <PageTitle title="Edit merchant" />
      <Segmented
        style={{ marginBottom: 24 }}
        value={SEGMENTED.HOME_PAGE.value}
      />
      <ContentForm
        loading={loading}
        initialValues={homePageContent?.data}
        defaultValues={defaultHomePageContent?.data}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default HomePage;
