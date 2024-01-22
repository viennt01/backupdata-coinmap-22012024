import React, { useState } from 'react';
import {
  Form,
  Col,
  Row,
  Typography,
  Upload,
  message,
  FormInstance,
} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ERROR_CODE } from '@/constants/code-constants';
import type { RcFile } from 'antd/es/upload/interface';
import { FormValues } from './merchant-create-form';
import { ACTION_UPLOAD } from '../fetcher';

const { Text } = Typography;

interface WebsiteInfoProps {
  form: FormInstance<FormValues>;
}

const EmailSender = ({ form }: WebsiteInfoProps) => {
  const [imageLoading, setImageLoading] = useState(false);

  const emailLogoUrl = Form.useWatch('email_logo_url', form);
  const emailBannerUrl = Form.useWatch('email_banner_url', form);

  const beforeUploadImage = (file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isLt5M;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normImage = (e: any) => {
    if (!e.fileList[0]?.status) return [];
    if (e.fileList[0]?.status === 'uploading') setImageLoading(true);
    if (e.fileList[0]?.status === 'done') {
      setImageLoading(false);
      const { response } = e.fileList[0];
      if (response.error_code !== ERROR_CODE.SUCCESS) return [];
      return response.payload.file_url;
    }
    return e?.fileList;
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={24} lg={4}>
          <Form.Item
            name="email_logo_url"
            label={<Text strong>Email Logo</Text>}
            getValueFromEvent={normImage}
          >
            <Upload.Dragger
              style={{
                maxWidth: '128px',
                maxHeight: '128px',
              }}
              disabled={imageLoading}
              maxCount={1}
              action={ACTION_UPLOAD}
              showUploadList={false}
              beforeUpload={beforeUploadImage}
            >
              <DisplayImage imageUrl={emailLogoUrl} uploading={imageLoading} />
            </Upload.Dragger>
          </Form.Item>
        </Col>
        <Col span={24} lg={8}>
          <Form.Item
            name="email_banner_url"
            label={<Text strong>Email Banner</Text>}
            getValueFromEvent={normImage}
          >
            <Upload.Dragger
              style={{
                width: '100%',
                maxWidth: '384px',
                maxHeight: '128px',
              }}
              disabled={imageLoading}
              maxCount={1}
              action={ACTION_UPLOAD}
              showUploadList={false}
              beforeUpload={beforeUploadImage}
            >
              <DisplayImage
                imageUrl={emailBannerUrl}
                uploading={imageLoading}
              />
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default EmailSender;

const DisplayImage = ({
  imageUrl,
  uploading,
}: {
  imageUrl: string | FileList | undefined;
  uploading: boolean;
}) => {
  if (!imageUrl)
    return (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

  if (uploading && typeof imageUrl !== 'string') return <LoadingOutlined />;

  return (
    <img
      src={imageUrl as string}
      alt="avatar"
      style={{
        width: '100%',
        maxWidth: '480px',
        maxHeight: '160px',
        margin: '-16px 0',
      }}
    />
  );
};
