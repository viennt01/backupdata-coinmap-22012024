import {
  Button,
  Modal,
  Form,
  Row,
  Col,
  Typography,
  Select,
  Upload,
} from 'antd';
import React, { useEffect } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { InternalFieldProps } from 'rc-field-form/lib/Field';
import { ImportCSVFormValues } from './index';

interface ImportCSVModalProps {
  loading: boolean;
  open: boolean;
  eventOptions: {
    label: string;
    value: string;
  }[];
  handleOk: (formValues: ImportCSVFormValues) => void;
  handleCancel: () => void;
}

const { Option } = Select;
const { Text } = Typography;

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  loading,
  open,
  eventOptions,
  handleOk,
  handleCancel,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) form.resetFields();
  }, [open, form]);

  const normFile: InternalFieldProps['getValueFromEvent'] = (e) => {
    return e.fileList[0] ? [e.fileList[0].originFileObj] : [];
  };

  const onOke = () => form.submit();

  const onCancel = () => handleCancel();

  return (
    <Modal
      title="Import CSV file"
      open={open}
      onOk={onOke}
      onCancel={loading ? () => null : onCancel}
      maskClosable={!loading}
      footer={[
        <Button key="back" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onOke}>
          Ok
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item
              name="event_id"
              label={<Text strong>Event</Text>}
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'Event is required' }]}
            >
              <Select placeholder="Event" size="large" disabled={loading}>
                {eventOptions.map((item) => (
                  <Option value={item.value} key={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              label={<Text strong>CSV file</Text>}
              style={{ margin: 0 }}
              rules={[{ required: true, message: 'File is required' }]}
            >
              <Upload maxCount={1} accept=".csv" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />} disabled={loading}>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ImportCSVModal;
