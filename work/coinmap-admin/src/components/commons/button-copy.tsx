import { useState } from 'react';
import { CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Tooltip } from 'antd';

interface CopyIconProps {
  title?: string;
  copyValue?: string;
  buttonProps?: ButtonProps;
}

const CopyIcon = ({ title, copyValue, buttonProps }: CopyIconProps) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(copyValue ?? '');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <Tooltip title={copiedCode ? 'Copied' : title ?? 'Copy'}>
      <Button
        disabled={copiedCode || !copyValue}
        type="ghost"
        size="small"
        {...buttonProps}
        icon={
          copiedCode ? (
            <CheckCircleOutlined style={{ color: '#52C41A' }} />
          ) : (
            <CopyOutlined />
          )
        }
        onClick={handleCopyCode}
      ></Button>
    </Tooltip>
  );
};

export default CopyIcon;
