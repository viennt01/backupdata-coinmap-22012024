import React from 'react';
import { Form, Input, Select, Col, Row, Typography } from 'antd';
import { MERCHANTS_STATUS } from '@/constants/merchants';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ProfileInfoProps {
  create: boolean;
}

const ProfileInfo = ({ create }: ProfileInfoProps) => {
  return (
    <>
      <Title level={3}>Profile</Title>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="name"
            label={<Text strong>Name</Text>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input size="large" placeholder="ABC" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              { type: 'email', message: 'Email is invalid' },
              { required: true, message: 'Email is required' },
            ]}
          >
            <Input
              size="large"
              placeholder="abc@email.com"
              allowClear
              disabled={!create}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="domain"
            label={<Text strong>Domain</Text>}
            rules={[{ required: true, message: 'Domain is required' }]}
          >
            <Input
              size="large"
              placeholder="https://abcxyz.tech"
              allowClear
              disabled={!create}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="code"
            label={<Text strong>Code</Text>}
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input
              size="large"
              placeholder="abcxyz"
              allowClear
              disabled={!create}
            />
          </Form.Item>
        </Col>

        {/* <Col span={24} lg={12}>
          <Form.Item
            name="commission"
            label={<Text strong>Commission</Text>}
            rules={[{ required: true, message: 'Commission is required' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              size="large"
              placeholder="Enter commission"
              min={0}
              max={100}
              step={1}
              precision={2}
              formatter={(value) => value + '%'}
            />
          </Form.Item>
        </Col> */}
        <Col span={24} lg={12}>
          <Form.Item
            name="status"
            label={<Text strong>Status</Text>}
            rules={[{ required: true, message: 'Merchant status is required' }]}
          >
            <Select
              placeholder="Select merchant status"
              size="large"
              options={Object.values(MERCHANTS_STATUS).map((status) => ({
                label: status,
                value: status,
              }))}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={24}>
          <Form.Item name="description" label={<Text strong>Description</Text>}>
            <TextArea rows={6} />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default ProfileInfo;
