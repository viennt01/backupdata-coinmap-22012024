import { ReactNode, useState } from 'react';
import { Form, message, Upload, Button } from 'antd';
import { ERROR_CODE } from '@/constant/error-code';
import type { RcFile } from 'antd/es/upload/interface';
import { ACTION_UPLOAD } from '@/components/settings/fetcher';
import { UploadOutlined } from '@ant-design/icons';
import { Rule } from 'antd/es/form';

interface Props {
  label: ReactNode;
  fieldName: string;
  rules?: Rule[];
}

const UploadFile = ({ label, fieldName, rules }: Props) => {
  const [uploadLoading, setUploadLoading] = useState(false);

  const beforeUploadFile = (file: RcFile) => {
    const isAcceptable = ['application/pdf'].includes(file.type);
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
  const normFile = (e: any) => {
    if (!e.fileList[0]?.status) return [];
    if (e.fileList[0]?.status === 'uploading') setUploadLoading(true);
    if (e.fileList[0]?.status === 'done') {
      setUploadLoading(false);
      const { response } = e.fileList[0];
      if (response.error_code !== ERROR_CODE.SUCCESS) return [];
      return [{ ...e.fileList[0], url: response.payload.file_url }];
    }
    return e?.fileList;
  };

  return (
    <Form.Item
      name={fieldName}
      label={label}
      rules={rules}
      valuePropName="fileList"
      getValueFromEvent={normFile}
    >
      <Upload
        disabled={uploadLoading}
        maxCount={1}
        action={ACTION_UPLOAD}
        beforeUpload={beforeUploadFile}
      >
        <Button disabled={uploadLoading} size="large" icon={<UploadOutlined />}>
          Click to Upload
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default UploadFile;
