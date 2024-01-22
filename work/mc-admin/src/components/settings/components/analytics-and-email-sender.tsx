import Link from 'next/link';
import {
  Card,
  Space,
  Form,
  Row,
  Col,
  Input,
  Typography,
  FormInstance,
  Tag,
} from 'antd';
import { FormValues } from '@/components/settings';
import UploadImage from './common/upload-image';
import { useContext, useState } from 'react';
import EmailSender from './email-sender';
import { SettingsContext } from '@/components/settings';

const { Title, Text } = Typography;

export const COLORS = {
  COMPLETED: '#52C41A',
  NOT_COMPLETED: '#F5222D',
};

interface Props {
  form: FormInstance<FormValues>;
  canSettingWebsite: boolean;
}

const AnalyticsAndEmailSender = ({ form, canSettingWebsite }: Props) => {
  const [showEmailSenderSettings, setShowEmailSenderSettings] = useState(false);
  const { merchantInfo } = useContext(SettingsContext);
  const verifySender = !!merchantInfo?.config.verified_sender;
  const emailSender = merchantInfo?.config.email_sender?.from_email;

  return (
    <Card
      bordered={false}
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Analytics {canSettingWebsite && '& Email Sender'}
          </Title>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Form.Item name="facebook_pixel_id" label="Facebook pixel ID">
            <Input
              size="large"
              placeholder="Enter Facebook pixel ID"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item
            name="google_tag_manager_id"
            label="Google Analytics (View ID)"
          >
            <Input
              size="large"
              placeholder="Enter Google Analytic view ID"
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} hidden={!canSettingWebsite}>
        <Col span={24}>
          <Form.Item style={{ marginBottom: 0 }}>
            <Text>
              <strong>Email sender setting</strong>{' '}
              <Tag
                style={{ borderRadius: 12 }}
                color={verifySender ? COLORS.COMPLETED : COLORS.NOT_COMPLETED}
              >
                {verifySender ? 'Completed' : 'Not Completed'}
              </Tag>
              <br />(
              <Text type="warning">
                <strong>This is important information.</strong>
              </Text>{' '}
              We will use this email sender to be able to send emails to your
              customers.)
            </Text>
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item>
            <Link
              style={{ textDecoration: 'underline' }}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowEmailSenderSettings(true);
              }}
            >
              {verifySender ? emailSender : 'Click to edit Email Sender'}
            </Link>
          </Form.Item>
        </Col>
        <Col span={24} lg={4}>
          <UploadImage
            form={form}
            fieldName="email_logo_url"
            label="Email Logo"
            description={
              <>
                Size: <strong>64x64 px</strong>
              </>
            }
          />
        </Col>
        <Col span={24} lg={8}>
          <UploadImage
            form={form}
            fieldName="email_banner_url"
            label="Email Banner"
            description={
              <>
                Width: <strong>600px</strong>
              </>
            }
            width={'100%'}
          />
        </Col>
      </Row>

      <EmailSender
        open={showEmailSenderSettings}
        onClose={() => setShowEmailSenderSettings(false)}
      />
    </Card>
  );
};

export default AnalyticsAndEmailSender;
