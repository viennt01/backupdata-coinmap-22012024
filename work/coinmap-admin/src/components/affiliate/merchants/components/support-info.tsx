import React from 'react';
import { Form, Input, Col, Row, Typography } from 'antd';

const { Text } = Typography;

const SupportInfo = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item name="support_phone" label={<Text strong>Phone</Text>}>
            <Input
              size="large"
              placeholder="Enter your phone numbers"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="support_email" label={<Text strong>Email</Text>}>
            <Input size="large" placeholder="Enter your email" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="support_telegram"
            label={<Text strong>Telegram</Text>}
          >
            <Input size="large" placeholder="Enter your link" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="support_discord" label={<Text strong>Discord</Text>}>
            <Input size="large" placeholder="Enter your link" allowClear />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default SupportInfo;
