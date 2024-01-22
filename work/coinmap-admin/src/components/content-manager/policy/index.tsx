import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/commons/page-title';
import ContentForm from './components/content-form';
import { FormValues, PolicyContent } from './interface';
import {
  createPolicyContent,
  getPolicyContent,
  updatePolicyContent,
} from './fetcher';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';

const PolicyPage = () => {
  const [loading, setLoading] = useState(false);
  const [policyContent, setPolicyContent] = useState<PolicyContent>();

  const handleSubmit = (formValues: FormValues) => {
    setLoading(true);
    let handleUpdate;
    if (policyContent?.id) {
      handleUpdate = () => updatePolicyContent(policyContent.id, formValues);
    } else {
      handleUpdate = () => createPolicyContent(formValues);
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
    getPolicyContent()
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS && res.payload[0]) {
          setPolicyContent(res.payload[0]);
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
      <PageTitle title="Default policy content" />
      <ContentForm
        loading={loading}
        initialValues={policyContent?.data}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default PolicyPage;
