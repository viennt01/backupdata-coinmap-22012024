import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { Typography, Button } from 'antd';
import React from 'react';

export interface PageTitleProps {
  title: string;
  previousPath?: string;
}

const { Title } = Typography;

const PageTitle: React.FC<PageTitleProps> = ({ title, previousPath }) => {
  const router = useRouter();

  return (
    <Title
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span>{title}</span>
      {previousPath && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          size="large"
          onClick={() => router.push(previousPath ?? '')}
        >
          Go back
        </Button>
      )}
    </Title>
  );
};
export default PageTitle;
