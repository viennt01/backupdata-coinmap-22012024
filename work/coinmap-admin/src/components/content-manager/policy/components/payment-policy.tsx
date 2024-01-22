import React from 'react';
import {
  Form,
  Col,
  Row,
  Typography,
  Tabs,
  TabsProps,
  Space,
  Button,
} from 'antd';
import { LOCALE } from '@/constants/code-constants';
import CustomReactQuill from '@/components/commons/custom-react-quill';

const { Title, Text } = Typography;

interface Props {
  showResetDefault?: boolean;
  handleResetDefault?: () => void;
}

const renderTabContent = (key: string) => {
  return (
    <Row gutter={16}>
      <Col span={24}>
        <Form.Item
          name={[key, 'payment_policy', 'content']}
          label={<Text strong>Content</Text>}
          rules={[{ required: true, message: 'Field is required' }]}
        >
          <CustomReactQuill />
        </Form.Item>
      </Col>
    </Row>
  );
};

const PaymentPolicy = ({ showResetDefault, handleResetDefault }: Props) => {
  const items: TabsProps['items'] = Object.values(LOCALE).map((locale) => ({
    key: locale,
    label: locale.toUpperCase(),
    children: renderTabContent(locale),
    forceRender: true,
  }));

  return (
    <>
      <Title level={3}>
        <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          Payment policy
          <Button hidden={!showResetDefault} onClick={handleResetDefault}>
            Reset Default
          </Button>
        </Space>
      </Title>
      <Tabs items={items} />
    </>
  );
};

export default PaymentPolicy;
