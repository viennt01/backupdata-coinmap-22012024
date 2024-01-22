import COLORS from '@/constants/color';
import { Tag, ConfigProvider } from 'antd';

export enum TagType {
  SUCCESS,
  WARNING,
  WARNING_,
  ERROR,
  DEFAULT,
  INFO,
}

interface Props {
  content: string;
  type: TagType;
}

export default function AppTag({ content, type }: Props) {
  switch (type) {
    case TagType.SUCCESS: {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLORS.ALGAE,
              borderRadius: 100,
              fontSize: 12,
            },
          }}
        >
          <Tag.CheckableTag checked>{content}</Tag.CheckableTag>
        </ConfigProvider>
      );
    }
    case TagType.INFO: {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLORS.PRIMARY,
              borderRadius: 100,
              fontSize: 12,
            },
          }}
        >
          <Tag.CheckableTag checked>{content}</Tag.CheckableTag>
        </ConfigProvider>
      );
    }
    case TagType.WARNING_: {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLORS.CADMIUM_ORANGE,
              borderRadius: 100,
              fontSize: 12,
            },
          }}
        >
          <Tag.CheckableTag checked>{content}</Tag.CheckableTag>
        </ConfigProvider>
      );
    }
    case TagType.WARNING: {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLORS.SAFFRON_MANGO,
              borderRadius: 100,
              fontSize: 12,
            },
          }}
        >
          <Tag.CheckableTag checked>{content}</Tag.CheckableTag>
        </ConfigProvider>
      );
    }
    case TagType.ERROR: {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLORS.SUNSET_ORANGE,
              borderRadius: 100,
              fontSize: 12,
            },
          }}
        >
          <Tag.CheckableTag checked>{content}</Tag.CheckableTag>
        </ConfigProvider>
      );
    }
    case TagType.DEFAULT: {
      return (
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: COLORS.JET_GREY,
              borderRadius: 100,
              fontSize: 12,
            },
          }}
        >
          <Tag.CheckableTag checked>{content}</Tag.CheckableTag>
        </ConfigProvider>
      );
    }
  }
}
