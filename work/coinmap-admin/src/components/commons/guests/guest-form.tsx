import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select, Col, Row, Typography } from 'antd';
import { useRouter } from 'next/router';
import {
  getGuestDetails,
  AdminGetUserOutput,
  getEventList,
  AdminListEventOutput,
} from '@/utils/api-getters';
import {
  ATTEND_STATUS,
  ERROR_CODE,
  EVENT_CONFIRM_STATUS,
  INVITE_CODE_TYPE,
  PAYMENT_STATUS,
} from '@/constants/code-constants';
import { errorToast } from '@/hook/toast';
import { ROUTERS } from '@/constants/router';

interface GuestFormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
  handleDelete?: () => void;
}

export interface FormValues {
  event_id: string;
  fullname: string;
  email: string;
  phone: string;
  type: string;
  confirm_status: string;
  invite_code: string;
  attend: boolean;
  telegram?: string;
  payment_status: string;
}

interface OptionSelect {
  label: string;
  value: string;
}

const { Option } = Select;
const { Text } = Typography;

const GuestForm: React.FC<GuestFormProps> = ({
  create,
  handleSubmit,
  handleDelete,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [eventOptions, setEventOptions] = useState<OptionSelect[]>([]);

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

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    getGuestDetails(id as string)
      .then((res: AdminGetUserOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          form.setFieldsValue(res.payload);
        } else {
          errorToast('Failed to get event details');
          router.push(ROUTERS.EVENTS);
        }
      })
      .catch((e: Error) => {
        errorToast('Failed to get event details');
        console.log(e);
        router.push(ROUTERS.EVENTS);
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
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="event_id"
            label={<Text strong>Event</Text>}
            rules={[{ required: true, message: 'Event is required' }]}
          >
            <Select placeholder="Select event" size="large" disabled={!create}>
              {eventOptions.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="fullname"
            label={<Text strong>Name</Text>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input
              size="large"
              placeholder="Enter name"
              allowClear
              disabled={!create}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="email"
            label={<Text strong>Email</Text>}
            rules={[
              { type: 'email', message: 'Email is invalid' },
              { required: true, message: 'Email is required' },
            ]}
          >
            <Input size="large" placeholder="Enter email" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="phone"
            label={<Text strong>Phone</Text>}
            rules={[
              () => ({
                validator(_, value) {
                  const reg = /^\d+$/;
                  if (!value || reg.test(value)) return Promise.resolve();
                  return Promise.reject(new Error('Phone number is invalid'));
                },
              }),
            ]}
          >
            <Input
              size="large"
              placeholder="Enter phone"
              allowClear
              disabled={!create}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="type"
            label={<Text strong>Guest type</Text>}
            initialValue={INVITE_CODE_TYPE.VIP}
            rules={[{ required: true, message: 'Type is required' }]}
          >
            <Select placeholder="Select type" size="large" disabled={!create}>
              {Object.values(INVITE_CODE_TYPE).map((type) => (
                <Option value={type} key={type}>
                  {type}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="confirm_status"
            label={<Text strong>Confirm status</Text>}
            initialValue={EVENT_CONFIRM_STATUS.APPROVED}
            rules={[{ required: true, message: 'Confirm status is required' }]}
          >
            <Select placeholder="Select guest type" size="large">
              {Object.values(EVENT_CONFIRM_STATUS).map((status) => (
                <Option value={status} key={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item name="telegram" label={<Text strong>Telegram</Text>}>
            <Input
              size="large"
              placeholder="Enter telegram"
              allowClear
              disabled={!create}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="payment_status"
            label={<Text strong>Payment status</Text>}
            initialValue={PAYMENT_STATUS.WAITING}
            rules={[{ required: true, message: 'Payment status is required' }]}
          >
            <Select placeholder="Select payment status" size="large">
              {Object.values(PAYMENT_STATUS).map((status) => (
                <Option value={status} key={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {!create && (
        <Row gutter={16}>
          <Col span={24} lg={12}>
            <Form.Item
              name="invite_code"
              label={<Text strong>Invite code</Text>}
              rules={[{ required: true, message: 'Invite code is required' }]}
            >
              <Input
                size="large"
                placeholder="Enter invite code"
                allowClear
                disabled={!create}
              />
            </Form.Item>
          </Col>
          <Col span={24} lg={12}>
            <Form.Item
              name="attend"
              label={<Text strong>Attend</Text>}
              initialValue={false}
              rules={[{ required: true, message: 'Attend is required' }]}
            >
              <Select placeholder="Select attend" size="large">
                <Option value={true}>{ATTEND_STATUS.true}</Option>
                <Option value={false}>{ATTEND_STATUS.false}</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      )}

      <Row gutter={16}>
        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
            }}
          >
            {!create && (
              <Button
                type="primary"
                danger
                size="large"
                onClick={handleDelete}
                disabled
              >
                Delete
              </Button>
            )}
            <Button
              type="default"
              size="large"
              onClick={redirectPage(ROUTERS.GUESTS)}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" size="large">
              Submit
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default GuestForm;
