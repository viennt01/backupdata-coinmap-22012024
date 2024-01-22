import { Card, Space, Form, Row, Col, Input, Typography } from 'antd';

const { Title } = Typography;

const Support = () => {
  return (
    <Card
      bordered={false}
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Support
          </Title>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Form.Item name="support_phone" label="Phone">
            <Input
              size="large"
              placeholder="Enter your phone number"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="support_email" label="Email">
            <Input size="large" placeholder="Enter your email" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="support_telegram" label="Telegram">
            <Input
              size="large"
              placeholder="Enter your telegram link"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item name="support_discord" label="Discord">
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

export default Support;
