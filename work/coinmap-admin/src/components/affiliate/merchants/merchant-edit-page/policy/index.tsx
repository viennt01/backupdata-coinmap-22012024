import React, { useEffect, useState } from 'react';
import PageTitle from '@/components/commons/page-title';
import Segmented, { SEGMENTED } from '../segmented';
import ContentForm from '@/components/content-manager/policy/components/content-form';
import {
  FormValues,
  PolicyContent,
} from '@/components/content-manager/policy/interface';
import {
  getDefaultPolicyContent,
  getPolicyContent,
  updatePolicyContent,
} from './fetcher';
import { errorToast, successToast } from '@/hook/toast';
import { ERROR_CODE } from '@/constants/code-constants';
import { useRouter } from 'next/router';

const PolicyPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [policyContent, setPolicyContent] = useState<PolicyContent>();
  const [defaultPolicyContent, setDefaultPolicyContent] =
    useState<PolicyContent>();

  const handleSubmit = (formValues: FormValues) => {
    setLoading(true);
    const merchantId = router.query.id as string;
    updatePolicyContent(merchantId, policyContent?.id, formValues)
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
    Promise.all([getDefaultPolicyContent(), getPolicyContent(merchantId)])
      .then(([defaultContentRes, contentRes]) => {
        if (
          defaultContentRes.error_code === ERROR_CODE.SUCCESS &&
          defaultContentRes.payload[0]
        ) {
          setDefaultPolicyContent(defaultContentRes.payload[0]);
        }

        if (
          contentRes.error_code === ERROR_CODE.SUCCESS &&
          contentRes.payload[0]
        ) {
          setPolicyContent(contentRes.payload[0]);
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
      <Segmented style={{ marginBottom: 24 }} value={SEGMENTED.POLICY.value} />
      <ContentForm
        loading={loading}
        initialValues={policyContent?.data}
        defaultValues={defaultPolicyContent?.data}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default PolicyPage;
