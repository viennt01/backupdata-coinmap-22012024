import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Space,
  Typography,
  Input,
  Row,
  Select,
  InputNumber,
} from 'antd';
import { useRouter } from 'next/router';
import { ERROR_CODE } from '@/constants/code-constants';
import { errorToast } from '@/hook/toast';
import { getById } from '../fetcher';
import CustomCard from '@/components/commons/custom-card';
import { ROUTERS } from '@/constants/router';

const { Option } = Select;

const { Text } = Typography;

interface FormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
}

export interface FormValues {
  name: string;
  name_vi: string;
  quantity: number;
  type: string;
  discount_amount: number;
  discount_rate: number;
  order: number;
}

const initialValue = {
  name: '',
  name_vi: '',
  quantity: '',
  type: 'MONTH',
  discount_amount: '',
  discount_rate: '',
  order: 1,
};

const FaqForm: React.FC<FormProps> = ({ handleSubmit }) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    getById(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.setFieldsValue({
            name: res.payload.data.translation.en.name,
            name_vi: res.payload.data.translation.vi.name,
            quantity: res.payload.data.translation.en.quantity,
            type: res.payload.data.translation.en.type,
            order: res.payload.data.translation.en.order,
            discount_amount: res.payload.data.translation.en.discount_amount,
            discount_rate: res.payload.data.translation.en.discount_rate,
          });
        } else {
          errorToast('Failed to get faq detail');
          router.push(ROUTERS.AFFILIATE_TBOT_PERIOD);
        }
      })
      .catch((e: Error) => {
        errorToast('Failed to get faq detail');
        console.log(e);
        router.push(ROUTERS.AFFILIATE_TBOT_PERIOD);
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
            name="name"
            label={<Text strong>Name</Text>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input size="large" placeholder="Enter the name" />
          </Form.Item>
          <Form.Item
            name="name_vi"
            label={<Text strong>Name VI</Text>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input size="large" placeholder="Enter the name" />
          </Form.Item>
          <Form.Item
            name="quantity"
            label={<Text strong>Quantity</Text>}
            rules={[{ required: true, message: 'Quantity is required' }]}
          >
            <InputNumber
              addonAfter={
                <Form.Item name="type" noStyle>
                  <Select style={{ width: 100 }}>
                    <Option value="MONTH">MONTH</Option>
                    <Option value="DAY">DAY</Option>
                  </Select>
                </Form.Item>
              }
              style={{ width: '100%' }}
              size="large"
              type="number"
              placeholder="Enter the quantity"
            />
          </Form.Item>
          <Form.Item
            name="discount_amount"
            label={<Text strong>Discount Amount($)</Text>}
            rules={[{ required: true, message: 'Discount amount is required' }]}
          >
            <Input
              size="large"
              placeholder="Enter the discount amount"
              addonAfter="$"
            />
          </Form.Item>
          <Form.Item
            name="discount_rate"
            label={<Text strong>Discount Rate(%)</Text>}
            rules={[{ required: true, message: 'Discount rate is required' }]}
          >
            <Input
              type="number"
              size="large"
              min={0}
              max={1}
              step={0.1}
              placeholder="Enter the discount rate"
              addonAfter="%"
            />
          </Form.Item>
          <Form.Item
            name="order"
            label={<Text strong>Order</Text>}
            rules={[{ required: true, message: 'Order rate is required' }]}
          >
            <Input
              type="number"
              size="large"
              min={0}
              step={1}
              placeholder="Enter the order"
            />
          </Form.Item>

          <Row>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Space style={{ columnGap: '16px' }}>
                <Button
                  type="default"
                  size="large"
                  onClick={redirectPage(ROUTERS.AFFILIATE_TBOT_PERIOD)}
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
