import { Alert, Col, Form, FormInstance, Input, Row, Typography } from 'antd';
import { VerifyFormValues, STEPS } from './';
import { RefObject } from 'react';

const { Text } = Typography;

interface Props {
  form: FormInstance<VerifyFormValues>;
  currentStep: number;
  senderEmail: string;
  getUrlRef: RefObject<HTMLDivElement>;
}

const initialValues = {
  url_verify: '',
};

const VerifyForm = ({ form, currentStep, senderEmail, getUrlRef }: Props) => {
  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      scrollToFirstError
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <div
            style={{ margin: '6px 0' }}
            hidden={currentStep !== STEPS.VERIFY_URL}
          >
            <Alert
              message={`A confirmation email has been sent to ${senderEmail}`}
              type="info"
              showIcon
            />
          </div>
          <div>
            <Text ref={getUrlRef} disabled={currentStep !== STEPS.VERIFY_URL}>
              Step 1: Check your email and click to &quot;Verify Single
              Sender&quot; button to get verification URL in new tab.
            </Text>
          </div>
          <div>
            <Text disabled={currentStep !== STEPS.VERIFY_URL}>
              Step 2: Input your verification URL to verify your email sender.
            </Text>
          </div>
        </Col>
        <Col span={24}>
          <Form.Item
            name="url_verify"
            rules={[
              {
                required: true,
                message: 'Verified URL is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="https://app.sendgrid.com/..."
              allowClear
              disabled={currentStep !== STEPS.VERIFY_URL}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default VerifyForm;
