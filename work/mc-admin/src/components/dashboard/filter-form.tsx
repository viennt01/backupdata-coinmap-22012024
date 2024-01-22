import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Space, DatePicker, Popover } from 'antd';
import { DatePickerProps } from 'antd';
import { memo, useState } from 'react';
import dayjs from 'dayjs';
import { SegmentedValue } from 'antd/es/segmented';

interface FilterFormProps {
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  handleSearch: (from?: number, to?: number) => void;
}

interface FormValues {
  from: DatePickerProps['value'];
  to: DatePickerProps['value'];
}

const FILTER_ACTIONS = {
  TODAY: 'TODAY',
  YESTERDAY: 'YESTERDAY',
  LAST_7_DAYS: 'LAST_7_DAYS',
  LAST_30_DAYS: 'LAST_30_DAYS',
  ALL_TIME: 'ALL_TIME',
  CUSTOM: 'CUSTOM',
};

const FilterForm = ({ loading, handleSearch }: FilterFormProps) => {
  const [form] = Form.useForm<FormValues>();
  const [filterAction, setFilterAction] = useState(FILTER_ACTIONS.LAST_30_DAYS);
  const [showCustomFilter, setShowCustomFilter] = useState(false);

  const handleFilterDays = (days: number) => {
    const dateTo = new Date();
    const dateFrom = new Date(new Date().setDate(dateTo.getDate() + days));
    const startOfDateFrom = dayjs(dateFrom).startOf('day');
    const endOfDateTo = dayjs(dateTo).endOf('day');
    form.setFieldValue('from', startOfDateFrom);
    form.setFieldValue('to', endOfDateTo);
    handleSearch(startOfDateFrom.valueOf(), endOfDateTo.valueOf());
  };

  const handleFilterYesterdays = () => {
    const date = new Date();
    const yesterday = new Date(new Date().setDate(date.getDate() - 1));
    const startOfDateFrom = dayjs(yesterday).startOf('day');
    const endOfDateTo = dayjs(yesterday).endOf('day');
    form?.setFieldValue('from', startOfDateFrom);
    form?.setFieldValue('to', endOfDateTo);
    handleSearch(startOfDateFrom.valueOf(), endOfDateTo.valueOf());
  };

  const handleFilterAllTime = () => {
    form?.setFieldValue('from', null);
    form?.setFieldValue('to', null);
    handleSearch();
  };

  const filterHandlers = {
    [FILTER_ACTIONS.TODAY]: () => handleFilterDays(0),
    [FILTER_ACTIONS.YESTERDAY]: handleFilterYesterdays,
    [FILTER_ACTIONS.LAST_7_DAYS]: () => handleFilterDays(-7),
    [FILTER_ACTIONS.LAST_30_DAYS]: () => handleFilterDays(-30),
    [FILTER_ACTIONS.ALL_TIME]: handleFilterAllTime,
  };

  const handleChangeFilterAction = (value: SegmentedValue) => {
    filterHandlers[value]();
    setFilterAction(value as string);
  };

  const onFinish = (formValues: FormValues) => {
    let dateFrom;
    let dateTo;
    if (formValues.from) {
      dateFrom = dayjs(formValues.from).startOf('day');
    }
    if (formValues.to) {
      dateTo = dayjs(formValues.to).endOf('day');
    }
    handleSearch(dateFrom?.valueOf(), dateTo?.valueOf());
  };

  return (
    <Form form={form} size="large" onFinish={onFinish}>
      <Space wrap>
        <Button
          ghost={filterAction === FILTER_ACTIONS.TODAY}
          type={filterAction === FILTER_ACTIONS.TODAY ? 'primary' : 'ghost'}
          onClick={() => handleChangeFilterAction(FILTER_ACTIONS.TODAY)}
        >
          Today
        </Button>
        <Button
          ghost={filterAction === FILTER_ACTIONS.YESTERDAY}
          type={filterAction === FILTER_ACTIONS.YESTERDAY ? 'primary' : 'ghost'}
          onClick={() => handleChangeFilterAction(FILTER_ACTIONS.YESTERDAY)}
        >
          Yesterday
        </Button>
        <Button
          ghost={filterAction === FILTER_ACTIONS.LAST_7_DAYS}
          type={
            filterAction === FILTER_ACTIONS.LAST_7_DAYS ? 'primary' : 'ghost'
          }
          onClick={() => handleChangeFilterAction(FILTER_ACTIONS.LAST_7_DAYS)}
        >
          Last 7 days
        </Button>
        <Button
          ghost={filterAction === FILTER_ACTIONS.LAST_30_DAYS}
          type={
            filterAction === FILTER_ACTIONS.LAST_30_DAYS ? 'primary' : 'ghost'
          }
          onClick={() => handleChangeFilterAction(FILTER_ACTIONS.LAST_30_DAYS)}
        >
          Last 30 days
        </Button>
        <Button
          ghost={filterAction === FILTER_ACTIONS.ALL_TIME}
          type={filterAction === FILTER_ACTIONS.ALL_TIME ? 'primary' : 'ghost'}
          onClick={() => handleChangeFilterAction(FILTER_ACTIONS.ALL_TIME)}
        >
          All-time
        </Button>
        <Popover
          content={
            <Space wrap direction="vertical">
              <Form.Item style={{ margin: 0 }} name="from">
                <DatePicker placeholder="From" />
              </Form.Item>
              <Form.Item style={{ margin: 0 }} name="to">
                <DatePicker placeholder="To" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                style={{
                  width: '100%',
                  padding: '0 32px',
                }}
                onClick={() => {
                  setShowCustomFilter(false);
                  form.submit();
                }}
              />
            </Space>
          }
          placement="bottom"
          trigger="click"
          open={showCustomFilter}
          onOpenChange={(value) => setShowCustomFilter(value)}
        >
          <Button
            ghost={filterAction === FILTER_ACTIONS.CUSTOM}
            type={filterAction === FILTER_ACTIONS.CUSTOM ? 'primary' : 'ghost'}
            onClick={() => {
              setFilterAction(FILTER_ACTIONS.CUSTOM);
              setShowCustomFilter(true);
            }}
          >
            Custom
          </Button>
        </Popover>
      </Space>
    </Form>
  );
};

export default memo(FilterForm);
