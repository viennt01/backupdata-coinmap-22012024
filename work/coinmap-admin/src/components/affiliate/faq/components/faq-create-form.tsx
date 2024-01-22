import React, { useEffect } from 'react';
import { Button, Form, Space, Typography, Input, Row } from 'antd';
import { useRouter } from 'next/router';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast } from '@/hook/toast';
import { getFAQById } from '../fetcher';
import CustomCard from '@/components/commons/custom-card';
import { ROUTERS } from '@/constants/router';
import CustomReactQuill from '@/components/commons/custom-react-quill';

const { Text } = Typography;

interface FaqFormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
}

export interface FormValues {
  question: string;
  answer: string;
  question_vi: string;
  answer_vi: string;
}

const initialValue = {
  question: '',
  question_vi: '',
  answer: '',
  answer_vi: '',
  order: 1,
};

const FaqForm: React.FC<FaqFormProps> = ({ handleSubmit }) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    getFAQById(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.setFieldsValue({
            question: res.payload.data.translation.en.name,
            answer: res.payload.data.translation.en.answer,
            question_vi: res.payload.data.translation.vi.name,
            answer_vi: res.payload.data.translation.vi.answer,
          });
        } else {
          errorToast('Failed to get faq detail');
          router.push(ROUTERS.AFFILIATE_FAQ);
        }
      })
      .catch((e: Error) => {
        errorToast('Failed to get faq detail');
        console.log(e);
        router.push(ROUTERS.AFFILIATE_FAQ);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const redirectPage = (path: string) => () => {
    router.push(path);
  };

  const onFinish = (formValues: FormValues) => {
    handleSubmit(formValues);
  };

  return (
    <>
      <Form
        initialValues={initialValue}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <CustomCard style={{ marginBottom: '24px' }}>
          <Form.Item
            name="question"
            label={<Text strong>Question</Text>}
            rules={[{ required: true, message: 'Question is required' }]}
          >
            <Input size="large" placeholder="Enter the question" />
          </Form.Item>

          <Form.Item
            name="question_vi"
            label={<Text strong>Question VI</Text>}
            rules={[{ required: true, message: 'Question is required' }]}
          >
            <Input size="large" placeholder="Enter the question" />
          </Form.Item>

          <Form.Item
            name="answer"
            label={<Text strong>Answer</Text>}
            rules={[{ required: true, message: 'Answer is required' }]}
          >
            <CustomReactQuill />
          </Form.Item>

          <Form.Item
            name="answer_vi"
            label={<Text strong>Answer VI</Text>}
            rules={[{ required: true, message: 'Answer VI is required' }]}
          >
            <CustomReactQuill />
          </Form.Item>

          <Row>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space style={{ columnGap: '16px' }}>
                <Button
                  type="default"
                  size="large"
                  onClick={redirectPage(ROUTERS.AFFILIATE_FAQ)}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" size="large">
                  Submit
                </Button>
              </Space>
            </Space>
          </Row>
        </CustomCard>
      </Form>
    </>
  );
};

export default FaqForm;
