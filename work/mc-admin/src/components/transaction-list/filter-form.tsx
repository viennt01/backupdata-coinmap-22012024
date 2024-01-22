import {
  Space,
  Form,
  Button,
  Input,
  DatePicker,
  FormInstance,
  Select,
} from 'antd';
import type { DatePickerProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { ORDER_CATEGORY, STATUS } from '@/constant/transaction';
import { PackageList } from './fetcher';
import { useMemo } from 'react';
import QuickFilter from '@/components/common/quick-filter';

export interface FormValues {
  keyword: string;
  category: string; // order type
  name: string; // package name
  status: string; // transaction status
  from: DatePickerProps['value'];
  to: DatePickerProps['value'];
}

interface FilterFormProps {
  form: FormInstance<FormValues>;
  loading: boolean;
  packages: PackageList;
  handleSearch: () => void;
}

export default function FilterForm({
  form,
  loading,
  packages,
  handleSearch,
}: FilterFormProps) {
  const category = Form.useWatch('category', form);

  const packageOptions = useMemo(() => {
    const filteredPackages = category
      ? packages[category] ?? []
      : Object.values(packages).flat();
    return filteredPackages.map((item) => ({
      label: item.name,
      value: item.name,
    }));
  }, [packages, category]);

  return (
    <>
      <Form
        form={form}
        name="search_form"
        style={{ marginBottom: 16 }}
        onFinish={handleSearch}
      >
        <Space wrap>
          <Form.Item style={{ margin: 0 }} name="keyword">
            <Input placeholder="Keyword" allowClear style={{ minWidth: 140 }} />
          </Form.Item>
          <Form.Item style={{ margin: 0 }} name="category">
            <Select
              style={{ minWidth: 140 }}
              allowClear
              onClear={() => form.submit()}
              placeholder="Order type"
              options={Object.values(ORDER_CATEGORY).map((value) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>
          <Form.Item style={{ margin: 0 }} name="name">
            <Select
              style={{ minWidth: 180 }}
              allowClear
              showSearch
              onClear={() => form.submit()}
              placeholder="Package"
              options={packageOptions}
            ></Select>
          </Form.Item>
          <Form.Item style={{ margin: 0 }} name="status">
            <Select
              style={{ minWidth: 140 }}
              allowClear
              placeholder="Status"
              options={Object.values(STATUS).map((value) => ({
                label: value,
                value,
              }))}
            />
          </Form.Item>
          <Form.Item style={{ margin: 0 }} name="from">
            <DatePicker placeholder="From" style={{ minWidth: 140 }} />
          </Form.Item>
          <Form.Item style={{ margin: 0 }} name="to">
            <DatePicker placeholder="To" style={{ minWidth: 140 }} />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
            style={{ width: 'fit-content', padding: '0 32px' }}
          ></Button>
        </Space>
      </Form>
      <div>
        <QuickFilter
          form={form}
          loading={loading}
          handleSearch={handleSearch}
        />
      </div>
    </>
  );
}
