import { Col, Form, FormInstance, Input, Row, Typography } from 'antd';
import { RegisterFormValues, STEPS } from './';

const { Text } = Typography;

interface Props {
  form: FormInstance<RegisterFormValues>;
  currentStep: number;
}

const initialValues = {
  email: '',
  name: '',
  country: '',
  city: '',
  address: '',
};

const RegisterForm = ({ form, currentStep }: Props) => {
  return (
    <Form
      form={form}
      initialValues={initialValues}
      layout="vertical"
      scrollToFirstError
    >
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text disabled={currentStep !== STEPS.REGISTER}>
            Fill out information of email sender.
          </Text>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              {
                required: true,
                message: 'Email is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter email"
              allowClear
              disabled={currentStep !== STEPS.REGISTER}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="name"
            label={<Text strong>Name</Text>}
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter name"
              allowClear
              disabled={currentStep !== STEPS.REGISTER}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="country"
            label={<Text strong>Country</Text>}
            rules={[
              {
                required: true,
                message: 'Country is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter country"
              allowClear
              disabled={currentStep !== STEPS.REGISTER}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="city"
            label={<Text strong>City</Text>}
            rules={[
              {
                required: true,
                message: 'City is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter city"
              allowClear
              disabled={currentStep !== STEPS.REGISTER}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="address"
            label={<Text strong>Address</Text>}
            rules={[
              {
                required: true,
                message: 'Address is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Enter address"
              allowClear
              disabled={currentStep !== STEPS.REGISTER}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default RegisterForm;
