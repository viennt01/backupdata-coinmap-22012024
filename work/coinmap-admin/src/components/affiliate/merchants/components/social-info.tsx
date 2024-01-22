import React from 'react';
import { Form, Input, Col, Row, Typography } from 'antd';

const { Text } = Typography;

const SocialInfo = () => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item name="facebook_url" label={<Text strong>Facebook</Text>}>
            <Input
              size="large"
              placeholder="https://www.facebook.com/..."
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="twitter_url" label={<Text strong>Twitter</Text>}>
            <Input
              size="large"
              placeholder="https://twitter.com/..."
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="telegram_url" label={<Text strong>Telegram</Text>}>
            <Input size="large" placeholder="https://t.me/..." allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="youtube_url" label={<Text strong>Youtube</Text>}>
            <Input
              size="large"
              placeholder="https://www.youtube.com/..."
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="discord_url" label={<Text strong>Discord</Text>}>
            <Input
              size="large"
              placeholder="https://discord.gg/..."
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default SocialInfo;
