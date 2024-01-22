import React, { useEffect, useState } from 'react';
import { Button, Form, Select, Col, Row, Typography } from 'antd';
import { getEventList, AdminListEventOutput } from '@/utils/api-getters';
import {
  ERROR_CODE,
  EVENT_CONFIRM_STATUS,
  PAYMENT_STATUS,
} from '@/constants/code-constants';
import pushEmailPromotion, { EmailPromotion } from '../fetcher';
import { errorToast, successToast } from '@/hook/toast';

export interface FormValues {
  event_id: string;
  confirm_status: string;
  payment_status: string;
  attend: string;
}

interface OptionSelect {
  label: string;
  value: string;
}

const { Option } = Select;
const { Text } = Typography;

export default function EmailForm() {
  const [form] = Form.useForm();
  const [eventOptions, setEventOptions] = useState<OptionSelect[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // get all events to create event options
    getEventList('?page=1&size=9999999')
      .then((res: AdminListEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const eventOptions = res.payload.rows.map((record) => ({
            label: record.name,
            value: record.id,
          }));
          setEventOptions(eventOptions);
        }
      })
      .catch((e: Error) => console.log(e));
  }, []);

  const onFinish = (formValues: FormValues) => {
    setLoading(true);
    const data: EmailPromotion = {
      event_id: formValues.event_id,
      confirm_status: formValues.confirm_status,
      payment_status: formValues.payment_status,
      attend: formValues.attend
        ? formValues.attend === '1'
          ? true
          : false
        : undefined,
    };
    pushEmailPromotion(data)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          successToast('Push email successfully');
        }
      })
      .catch(() => {
        errorToast('Push email failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleResetFilter = () => {
    form.setFieldsValue({
      event_id: undefined,
      confirm_status: undefined,
      payment_status: undefined,
      attend: undefined,
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={24} lg={6}>
          <Form.Item name="event_id" label={<Text strong>Event</Text>}>
            <Select placeholder="Select event" size="large" allowClear>
              {eventOptions.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            label={<Text strong>Confirm status</Text>}
            name="confirm_status"
          >
            <Select placeholder="Confirm status" size="large" allowClear>
              {Object.values(EVENT_CONFIRM_STATUS).map((type) => (
                <Option value={type} key={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            label={<Text strong>Payment status</Text>}
            name="payment_status"
          >
            <Select placeholder="Payment status" size="large" allowClear>
              {Object.values(PAYMENT_STATUS).map((type) => (
                <Option value={type} key={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item label={<Text strong>Attend status</Text>} name="attend">
            <Select placeholder="Attend status" size="large" allowClear>
              <Option value="1">YES</Option>
              <Option value="0">NO</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
            }}
          >
            <Button type="default" size="large" onClick={handleResetFilter}>
              Reset filter
            </Button>
            <Button
              loading={loading}
              disabled={loading}
              type="primary"
              htmlType="submit"
              size="large"
            >
              Push
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
