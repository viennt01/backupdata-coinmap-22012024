import CustomCard from '@/components/commons/custom-card';
import { ROUTERS } from '@/constants/router';
import { Button, Form, Space } from 'antd';
import { useRouter } from 'next/router';
import PaymentPolicy from './payment-policy';
import { FormValues } from '../interface';
import { DeepPartial } from '@/constants/type';
import { LOCALE } from '@/constants/code-constants';
import { useEffect } from 'react';
import { errorToast } from '@/hook/toast';

interface Props {
  loading?: boolean;
  initialValues?: FormValues;
  defaultValues?: FormValues;
  handleSubmit: (formValues: FormValues) => void;
}

const ContentForm = ({
  loading,
  initialValues,
  defaultValues,
  handleSubmit,
}: Props) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  const handleResetDefault = (key: keyof FormValues['en']) => {
    if (!defaultValues) return;
    const formValues = Object.keys(defaultValues).reduce<
      DeepPartial<FormValues>
    >((result, locale) => {
      result[locale as LOCALE] = {
        ...result[locale as LOCALE],
        [key]: defaultValues[locale as LOCALE][key],
      };
      return result;
    }, {});
    form.setFieldsValue(formValues);
  };

  const onFinishFailed = () => {
    errorToast('The form is not completed');
  };

  const onFinish = (formValues: FormValues) => {
    handleSubmit(formValues);
  };

  useEffect(() => {
    if (!initialValues) return;
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      scrollToFirstError
      onFinishFailed={onFinishFailed}
      onFinish={onFinish}
    >
      <CustomCard style={{ marginBottom: '24px' }}>
        <PaymentPolicy
          showResetDefault={!!defaultValues}
          handleResetDefault={() => handleResetDefault('payment_policy')}
        />
      </CustomCard>

      <CustomCard
        style={{
          marginBottom: '24px',
          position: 'sticky',
          bottom: 0,
          zIndex: 11,
        }}
      >
        <Space style={{ columnGap: '16px' }}>
          <Button
            type="default"
            size="large"
            onClick={() => router.push(ROUTERS.AFFILIATE_MERCHANT)}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={loading}
          >
            Submit
          </Button>
        </Space>
      </CustomCard>
    </Form>
  );
};

export default ContentForm;
