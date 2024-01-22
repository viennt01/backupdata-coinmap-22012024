import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/commons/page-title';
import ContentForm from './components/content-form';
import {
  createHomePageContent,
  updateHomePageContent,
  getHomePageContent,
} from './fetcher';
import { ERROR_CODE } from '@/constants/code-constants';
import { FormValues, HomePageContent } from './interface';
import { errorToast, successToast } from '@/hook/toast';

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [homePageContent, setHomePageContent] = useState<HomePageContent>();

  const handleSubmit = (formValues: FormValues) => {
    setLoading(true);
    let handleUpdate;
    if (homePageContent?.id) {
      handleUpdate = () =>
        updateHomePageContent(homePageContent.id, formValues);
    } else {
      handleUpdate = () => createHomePageContent(formValues);
    }

    handleUpdate()
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
    getHomePageContent()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS && res.payload[0]) {
          setHomePageContent(res.payload[0]);
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
      <PageTitle title="Default home page content" />
      <ContentForm
        loading={loading}
        initialValues={homePageContent?.data}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default HomePage;
