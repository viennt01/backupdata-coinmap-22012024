import React, { useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  Col,
  Row,
  DatePicker,
  Typography,
  Select,
  Divider,
  InputNumber,
  Switch,
} from 'antd';
import { useRouter } from 'next/router';
import type { Dayjs } from 'dayjs';
import { getEventDetails, AdminGetEventOutput } from '@/utils/api-getters';
import { ERROR_CODE, EVENT_STATUS } from '@/constants/code-constants';
import dayjs from 'dayjs';
import { errorToast } from '@/hook/toast';
import { ROUTERS } from '@/constants/router';

interface EventFormProps {
  create: boolean;
  handleSubmit: (formValues: FormValues) => void;
  handleDelete?: () => void;
}

export interface FormValues {
  name: string;
  code: string;
  status: string;
  start_at: Dayjs;
  finish_at: Dayjs;
  attendees_number: number;
  email_remind_at: Dayjs | null;
  email_remind_template_id: string;
  email_confirm: boolean;
  email_confirm_template_id: string;
}

const { Text } = Typography;
const { Option } = Select;

const Vien: React.FC<EventFormProps> = ({
  create,
  handleSubmit,
  handleDelete,
}) => {
  const router = useRouter();
  const [form] = Form.useForm<FormValues>();

  useEffect(() => {
    const { id } = router.query;
    if (!id) return;
    getEventDetails(id as string)
      .then((res: AdminGetEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const {
            name,
            code,
            status,
            start_at,
            finish_at,
            attendees_number,
            email_remind_at,
            email_remind_template_id,
            email_confirm,
            email_confirm_template_id,
          } = res.payload;
          const initialValues = {
            name,
            code,
            status,
            start_at: dayjs(Number(start_at)),
            finish_at: dayjs(Number(finish_at)),
            attendees_number,
            email_remind_at: email_remind_at
              ? dayjs(Number(email_remind_at))
              : null,
            email_remind_template_id,
            email_confirm,
            email_confirm_template_id,
          };
          form.setFieldsValue(initialValues);
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

  const emailConfirm = Form.useWatch('email_confirm', form);
  const emailRemindAt = Form.useWatch('email_remind_at', form);
  const emailRemindTemplate = Form.useWatch('email_remind_template_id', form);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="name"
            label={<Text strong>Name</Text>}
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input size="large" placeholder="Enter event name" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="code"
            label={<Text strong>Code</Text>}
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input size="large" placeholder="Enter event code" allowClear />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="status"
            label={<Text strong>Status</Text>}
            initialValue={EVENT_STATUS.COMINGSOON}
            rules={[{ required: true, message: 'status is required' }]}
          >
            <Select placeholder="Select event status" size="large">
              {Object.values(EVENT_STATUS).map((status) => (
                <Option value={status} key={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            name="start_at"
            label={<Text strong>Start at</Text>}
            rules={[{ required: true, message: 'Start date is required' }]}
          >
            <DatePicker
              size="large"
              showTime
              placeholder="Enter start date"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            name="finish_at"
            label={<Text strong>Finish at</Text>}
            rules={[{ required: true, message: 'End date is required' }]}
          >
            <DatePicker
              size="large"
              showTime
              placeholder="Enter end date"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item
            name="attendees_number"
            label={<Text strong>Number guest</Text>}
            rules={[
              {
                validator: async (_, attendeesNumber) => {
                  if (
                    (attendeesNumber || attendeesNumber === 0) &&
                    attendeesNumber <= 0
                  ) {
                    return Promise.reject(new Error('Invalid value'));
                  }
                },
              },
            ]}
          >
            <InputNumber
              placeholder="Enter number guest"
              size="large"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            name="email_remind_template_id"
            label={<Text strong>Remind template email (ID)</Text>}
            rules={[
              {
                validator: async (_, emailRemindTemplate) => {
                  if (emailRemindAt) {
                    if (!emailRemindTemplate) {
                      return Promise.reject(
                        new Error('Remind template is required')
                      );
                    }
                  }
                },
              },
            ]}
          >
            <Input size="large" placeholder="Enter event name" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            name="email_remind_at"
            label={<Text strong>Remind at</Text>}
            rules={[
              {
                validator: async (_, emailRemindAt) => {
                  if (emailRemindTemplate) {
                    if (!emailRemindAt) {
                      return Promise.reject(new Error('Remind at is required'));
                    }
                  }
                },
              },
            ]}
          >
            <DatePicker
              size="large"
              showTime
              placeholder="Enter end date"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={24}>
          <Form.Item
            name="email_confirm"
            valuePropName="email_confirm"
            label={<Text strong>Send email confirm</Text>}
          >
            <Switch checked={emailConfirm} />
          </Form.Item>
        </Col>
        {emailConfirm && (
          <Col span={24} lg={12}>
            <Form.Item
              required
              name="email_confirm_template_id"
              label={<Text strong>Email confirm template (ID)</Text>}
              rules={[
                {
                  validator: async (_, emailConfirmTemplateId) => {
                    if (emailConfirm) {
                      if (!emailConfirmTemplateId) {
                        return Promise.reject(
                          new Error('Email template is required')
                        );
                      }
                    }
                  },
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter email template id"
                allowClear
              />
            </Form.Item>
          </Col>
        )}
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={24}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
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
              onClick={redirectPage(ROUTERS.EVENTS)}
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

export default Vien;
