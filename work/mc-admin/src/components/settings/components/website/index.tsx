import {
  Card,
  Space,
  Form,
  Row,
  Col,
  Input,
  Typography,
  FormInstance,
  Switch,
} from 'antd';
import { FormValues } from '@/components/settings';
import UploadImage from '../common/upload-image';
import UploadFile from '../common/upload-file';
import Theme from './theme';

const { Title, Text } = Typography;

interface Props {
  form: FormInstance<FormValues>;
}

const Website = ({ form }: Props) => {
  return (
    <Card
      bordered={false}
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Website
          </Title>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={24} lg={4}>
          <UploadImage
            form={form}
            fieldName="favicon_url"
            required
            label="Favicon"
            description={
              <>
                Size: <strong>32x32 px</strong>
              </>
            }
          />
        </Col>
        <Col span={24} lg={4}>
          <UploadImage
            form={form}
            fieldName="logo_url"
            required
            label="Header logo"
            description={
              <>
                Height: <strong>40px</strong>
              </>
            }
          />
        </Col>
        <Col span={24} lg={8}>
          <UploadImage
            form={form}
            fieldName="banner_url_1"
            width="100%"
            required
            label="Banner 1"
            description={
              <>
                Size: <strong>1920x480 px</strong>
              </>
            }
          />
        </Col>
        <Col span={24} lg={8}>
          <UploadImage
            form={form}
            fieldName="banner_url_2"
            width="100%"
            required
            label="Banner 2"
            description={
              <>
                Size: <strong>1920x330 px</strong>
              </>
            }
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={8}>
          <Form.Item
            name="copyright"
            label="Copyright"
            rules={[
              {
                required: true,
                message: 'Copyright is required',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="Ex: Copyright © 2021 Trading Hub AI. All rights reserved."
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={16}>
          <UploadFile
            fieldName="policy_files"
            label={
              <Text>
                Policy (Please ensure that the file format is PDF and the size
                is no larger than 5MB)
              </Text>
            }
            rules={[
              {
                required: true,
                message: 'Policy is required',
              },
            ]}
          />
        </Col>
        <Col span={24} lg={8}>
          <Form.Item
            name="hide_background_texture"
            label="Hide background texture"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Theme form={form} />
    </Card>
  );
};

export default Website;
