import React, { Fragment } from 'react';
import {
  Form,
  Input,
  Col,
  Row,
  Typography,
  Tabs,
  TabsProps,
  Space,
  Button,
} from 'antd';
import { LOCALE } from '@/constants/code-constants';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Props {
  showResetDefault?: boolean;
  handleResetDefault?: () => void;
}

const renderTabContent = (key: string) => {
  return (
    <>
      <Title level={4}>Title</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name={[key, 'steps_to_use', 'title', 'content']}
            label={<Text strong>Content</Text>}
            rules={[{ required: true, message: 'Field is required' }]}
          >
            <TextArea size="large" placeholder="Enter title" allowClear />
          </Form.Item>
        </Col>
      </Row>

      {[1, 2, 3, 4].map((value) => (
        <Fragment key={value}>
          <Title level={4}>Step {value}</Title>
          <Row gutter={16}>
            <Col span={24} lg={8}>
              <Form.Item
                name={[key, 'steps_to_use', `step_${value}`, 'title']}
                label={<Text strong>Title</Text>}
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <TextArea size="large" placeholder="Enter title" allowClear />
              </Form.Item>
            </Col>
            <Col span={24} lg={16}>
              <Form.Item
                name={[key, 'steps_to_use', `step_${value}`, 'description']}
                label={<Text strong>Description</Text>}
                rules={[{ required: true, message: 'Field is required' }]}
              >
                <TextArea
                  size="large"
                  placeholder="Enter description"
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
        </Fragment>
      ))}
    </>
  );
};

const StepsToUse = ({ showResetDefault, handleResetDefault }: Props) => {
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
          Step to use
          <Button hidden={!showResetDefault} onClick={handleResetDefault}>
            Reset Default
          </Button>
        </Space>
      </Title>
      <Tabs items={items} />
    </>
  );
};

export default StepsToUse;
