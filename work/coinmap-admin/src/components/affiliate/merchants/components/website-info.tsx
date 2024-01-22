import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  Col,
  Row,
  Typography,
  Upload,
  message,
  FormInstance,
  Button,
  Switch,
  Modal,
} from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ERROR_CODE } from '@/constants/code-constants';
import type { RcFile } from 'antd/es/upload/interface';
import { DOMAIN_TYPE } from '@/constants/merchants';
import { FormValues } from './merchant-create-form';
import { ACTION_UPLOAD } from '../fetcher';

const { Title, Text } = Typography;

interface WebsiteInfoProps {
  form: FormInstance<FormValues>;
}

const WebsiteInfo = ({ form }: WebsiteInfoProps) => {
  const [imageLoading, setImageLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();

  const faviconUrl = Form.useWatch('favicon_url', form);
  const logoUrl = Form.useWatch('logo_url', form);
  const bannerUrl1 = Form.useWatch('banner_url_1', form);
  const bannerUrl2 = Form.useWatch('banner_url_2', form);
  const userRegistration = Form.useWatch('user_registration', form) ?? false;

  const beforeUploadImage = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isLt2M;
  };

  const beforeUploadFile = (file: RcFile) => {
    const isAcceptable = file.type === 'application/pdf';
    if (!isAcceptable) {
      message.error('You can only upload PDF file!');
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('File must be smaller than 5MB!');
    }
    return isAcceptable && isLt5M;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normFile = (e: any) => {
    if (!e.fileList[0]?.status) return [];
    if (e.fileList[0]?.status === 'uploading') setFileLoading(true);
    if (e.fileList[0]?.status === 'done') {
      setFileLoading(false);
      const { response } = e.fileList[0];
      if (response.error_code !== ERROR_CODE.SUCCESS) return [];
      return [{ ...e.fileList[0], url: response.payload.file_url }];
    }
    return e?.fileList;
  };

  const handleClickShowBoxConform = (Notification: string) => {
    modal.confirm({
      title: 'Conform action',
      content: <Text>{Notification}</Text>,
      onCancel() {
        form.setFieldValue('user_registration', userRegistration);
      },
    });
  };

  const handleChangeSwitch = (checked: boolean) => {
    const NotificationOk = 'Are you sure to allow user register account?';
    const NotificationCancel =
      'Are you sure you do not allow user register account?';
    checked
      ? handleClickShowBoxConform(NotificationOk)
      : handleClickShowBoxConform(NotificationCancel);
  };

  return (
    <>
      {contextHolder}
      <Row gutter={16}>
        <Col span={12} lg={4}>
          <Form.Item
            name="favicon_url"
            label={<Text strong>Favicon</Text>}
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
              <DisplayImage imageUrl={faviconUrl} uploading={imageLoading} />
            </Upload.Dragger>
          </Form.Item>
        </Col>
        <Col span={12} lg={4}>
          <Form.Item
            name="logo_url"
            label={<Text strong>Header Logo</Text>}
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
              <DisplayImage imageUrl={logoUrl} uploading={imageLoading} />
            </Upload.Dragger>
          </Form.Item>
        </Col>
        <Col span={24} lg={4} />
        <Col span={24} lg={6}>
          <Form.Item
            name="banner_url_1"
            label={<Text strong>Banner 1</Text>}
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
              <DisplayImage imageUrl={bannerUrl1} uploading={imageLoading} />
            </Upload.Dragger>
          </Form.Item>
        </Col>
        <Col span={24} lg={6}>
          <Form.Item
            name="banner_url_2"
            label={<Text strong>Banner 2</Text>}
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
              <DisplayImage imageUrl={bannerUrl2} uploading={imageLoading} />
            </Upload.Dragger>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={24} lg={12}>
          <Form.Item name="copyright" label={<Text strong>Copyright</Text>}>
            <Input
              size="large"
              placeholder="Copyright 2022 by Coinmap. All rights reserved."
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="policy_files"
            label={<Text strong>Policy</Text>}
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              disabled={fileLoading}
              maxCount={1}
              action={ACTION_UPLOAD}
              beforeUpload={beforeUploadFile}
            >
              <Button
                disabled={fileLoading}
                size="large"
                icon={<UploadOutlined />}
              >
                Click to Upload
              </Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item name="domain_type" label={<Text strong>Domain Type</Text>}>
            <Select
              placeholder="Select merchant status"
              size="large"
              options={Object.values(DOMAIN_TYPE).map((type) => ({
                label: type,
                value: type,
              }))}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="facebook_pixel_id"
            label={<Text strong>Facebook Pixel ID</Text>}
          >
            <Input
              size="large"
              placeholder="Enter Facebook Pixel ID"
              allowClear
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="tracking_id"
            label={<Text strong>Google Analytics - Tracking ID</Text>}
          >
            <Input size="large" placeholder="Enter tracking ID" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="view_id"
            label={<Text strong>Google Analytics - View ID</Text>}
          >
            <Input size="large" placeholder="Enter view ID" allowClear />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="user_registration"
            label={<Text strong>Allow user register</Text>}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={handleChangeSwitch}
              checked={userRegistration}
            />
          </Form.Item>
        </Col>
        <Col span={24} lg={12}>
          <Form.Item
            name="hide_background_texture"
            label={<Text strong>Hide background texture</Text>}
            valuePropName="checked"
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default WebsiteInfo;

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
