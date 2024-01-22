import { Card, Space, Form, Row, Col, Input, Typography } from 'antd';
const { Title } = Typography;

const SocialMediaSettings = () => {
  return (
    <Card
      bordered={false}
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Social Media
          </Title>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Form.Item name="social_facebook" label="Facebook">
            <Input
              size="large"
              placeholder="Enter your facebook link"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="social_twitter" label="Twitter">
            <Input
              size="large"
              placeholder="Enter your twitter link"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="social_telegram" label="Telegram">
            <Input
              size="large"
              placeholder="Enter your telegram link"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="social_youtube" label="Youtube">
            <Input
              size="large"
              placeholder="Enter your youtube channel"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="social_discord" label="Discord">
            <Input
              size="large"
              placeholder="Enter your discord link"
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
};

export default SocialMediaSettings;
