import { ReactNode, useState } from 'react';
import { Form, message, FormInstance, Upload, Typography } from 'antd';
import { ERROR_CODE } from '@/constant/error-code';
import type { RcFile } from 'antd/es/upload/interface';
import { ACTION_UPLOAD } from '@/components/settings/fetcher';
import { FormValues } from '@/components/settings';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Rule } from 'antd/es/form';

const { Text } = Typography;

interface Props {
  form: FormInstance<FormValues>;
  fieldName: string;
  label: ReactNode;
  description?: ReactNode;
  rules?: Rule[];
  required?: boolean;
  height?: string;
  width?: string;
}

const UploadImage = ({
  form,
  fieldName,
  label,
  description,
  required,
  rules,
  height,
  width,
}: Props) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const imageUrl = Form.useWatch(fieldName, form);

  const beforeUploadImage = (file: RcFile) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must be smaller than 5MB!');
    }
    return isLt5M;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-unused-vars
  const normImage = (e: any) => {
    if (!e.fileList[0]?.status) return [];
    if (e.fileList[0]?.status === 'uploading') setUploadLoading(true);
    if (e.fileList[0]?.status === 'done') {
      setUploadLoading(false);
      const { response } = e.fileList[0];
      if (response.error_code !== ERROR_CODE.SUCCESS) return [];
      return response.payload.file_url;
    }
    return e?.fileList;
  };

  const renderLabel = (
    label: ReactNode,
    description?: ReactNode,
    required?: boolean
  ) => {
    return (
      <Text>
        <span>
          {required && (
            <span
              style={{
                fontSize: 14,
                lineHeight: 1,
                fontFamily: 'SimSun,sans-serif',
                color: '#ff4d4f',
              }}
            >
              *
            </span>
          )}{' '}
          {label}
        </span>
        <br />
        {description}
      </Text>
    );
  };

  return (
    <Form.Item
      name={fieldName}
      label={renderLabel(label, description, required)}
      rules={rules}
      required={false}
      getValueFromEvent={normImage}
    >
      <Upload.Dragger
        style={{
          width: width ?? '128px',
          height: height ?? '128px',
        }}
        disabled={uploadLoading}
        maxCount={1}
        action={ACTION_UPLOAD}
        showUploadList={false}
        beforeUpload={beforeUploadImage}
      >
        <UploadDisplay imageUrl={imageUrl} uploading={uploadLoading} />
      </Upload.Dragger>
    </Form.Item>
  );
};

export default UploadImage;

interface UploadDisplayProps {
  imageUrl: string | FileList | undefined;
  uploading: boolean;
}

const UploadDisplay = ({ imageUrl, uploading }: UploadDisplayProps) => {
  if (!imageUrl)
    return (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

  if (uploading && typeof imageUrl !== 'string') return <LoadingOutlined />;

  return (
    <div
      style={{
        width: '100%',
        height: '126px',
        margin: '-16px 0',
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    ></div>
  );
};
