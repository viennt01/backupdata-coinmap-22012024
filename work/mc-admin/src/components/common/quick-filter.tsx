import { Button, Space, Typography } from 'antd';
import { FormProps } from 'antd';
import dayjs from 'dayjs';

const { Title } = Typography;

interface QuickFilterProps {
  form: FormProps['form'];
  loading: boolean;
  handleSearch: () => void;
}

const QuickFilter = ({ form, loading, handleSearch }: QuickFilterProps) => {
  const handleFilterDays = (days: number) => {
    if (loading) return;
    const dateTo = new Date();
    const dateFrom = new Date(new Date().setDate(dateTo.getDate() - days));
    form?.setFieldValue('from', dayjs(dateFrom));
    form?.setFieldValue('to', dayjs(dateTo));
    handleSearch();
  };

  const handleFilterAllTime = () => {
    if (loading) return;
    form?.setFieldValue('from', null);
    form?.setFieldValue('to', null);
    handleSearch();
  };

  return (
    <Space wrap>
      <Title level={5} style={{ margin: 0 }}>
        Filter
      </Title>
      <Button size="small" onClick={() => handleFilterDays(0)}>
        Today
      </Button>
      <Button size="small" onClick={() => handleFilterDays(7)}>
        Last 7 days
      </Button>
      <Button size="small" onClick={() => handleFilterDays(30)}>
        Last 30 days
      </Button>
      <Button size="small" onClick={handleFilterAllTime}>
        All-time
      </Button>
    </Space>
  );
};

export default QuickFilter;
