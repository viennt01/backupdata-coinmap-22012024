import { ROUTERS } from '@/constants/router';
import { Segmented } from 'antd';
import { SegmentedProps, SegmentedValue } from 'antd/es/segmented';
import { useRouter } from 'next/router';

export const SEGMENTED = {
  GENERAL: {
    label: 'General',
    value: '',
  },
  HOME_PAGE: {
    label: 'Home Page',
    value: 'home-page',
  },
  POLICY: {
    label: 'Policy',
    value: 'policy',
  },
};

const SegmentedPage = ({ value, style }: Partial<SegmentedProps>) => {
  const router = useRouter();

  const handleChangeTab = (key: SegmentedValue) => {
    router.push(`${ROUTERS.AFFILIATE_MERCHANT}/${router.query.id}/${key}`);
  };

  return (
    <Segmented
      style={{ ...style }}
      size="large"
      value={value}
      options={Object.values(SEGMENTED)}
      onChange={handleChangeTab}
    />
  );
};

export default SegmentedPage;
