import type { TablePaginationConfig } from 'antd/es/table';
import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {
  Input,
  Space,
  Button,
  Col,
  Row,
  Form,
  Select,
  Tooltip,
  PaginationProps,
} from 'antd';
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SyncOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import EventsTable from './events-table';
import { useRouter } from 'next/router';
import PageTitle from '@/components/commons/page-title';
import CustomCard from '@/components/commons/custom-card';
import { exportCsv } from '@/utils/common';
import {
  getEventList,
  AdminListEventOutput,
  AdminGetEventDataOutput,
} from '@/utils/api-getters';
import {
  DEFAULT_PAGINATION,
  ERROR_CODE,
  EVENT_STATUS,
} from '@/constants/code-constants';
import { successToast } from '@/hook/toast';
import { ROUTERS } from '@/constants/router';

const MIN_TABLE_HEIGHT = 300;

interface FormValues {
  keyword: string;
  status: string;
}

const csvHeaders = [
  {
    name: 'Name',
    value: 'name',
  },
  {
    name: 'Code',
    value: 'code',
  },
  {
    name: 'Status',
    value: 'status',
  },
  {
    name: 'Start at',
    value: 'start_at',
    converter: (value: string) => new Date(Number(value)).toLocaleString(),
  },
  {
    name: 'Finish at',
    value: 'finish_at',
    converter: (value: string) => new Date(Number(value)).toLocaleString(),
  },
  {
    name: 'Created at',
    value: 'created_at',
    converter: (value: string) => new Date(Number(value)).toLocaleString(),
  },
  {
    name: 'Updated at',
    value: 'updated_at',
    converter: (value: string) => new Date(Number(value)).toLocaleString(),
  },
];

const { Option } = Select;

const EventsPage = () => {
  const router = useRouter();
  const [tableData, setTableData] = useState<AdminGetEventDataOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] =
    useState<TablePaginationConfig>(DEFAULT_PAGINATION);
  const [maxTableHeight, setMaxTableHeight] = useState(MIN_TABLE_HEIGHT);
  const searchRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  // calculate max height for table
  useLayoutEffect(() => {
    if (!searchRef.current) return;
    const { height } = searchRef.current.getBoundingClientRect();
    const HEADER_HEIGHT = 308;
    let tableHeight = window.innerHeight - height - HEADER_HEIGHT;
    if (tableHeight < MIN_TABLE_HEIGHT) tableHeight = MIN_TABLE_HEIGHT;
    setMaxTableHeight(tableHeight);
  }, [searchRef]);

  // get table data based on pagination and search form
  const getTableData = () => {
    setLoading(true);
    const { current, pageSize } = pagination;
    let queryParams = `?page=${current}&size=${pageSize}`;
    const { keyword, status } = form.getFieldsValue() as FormValues;
    if (keyword) queryParams += `&keyword=${keyword}`;
    if (status) queryParams += `&status=${status}`;
    getEventList(queryParams)
      .then((res: AdminListEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setTableData(res.payload.rows);
          const { page, size, total } = res.payload;
          setPagination((state) => ({
            ...state,
            current: page,
            pageSize: size,
            total,
          }));
        }
      })
      .catch((e: Error) => console.log(e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    getTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pagination)]);

  // update pagination
  const handleTableChange: PaginationProps['onChange'] = (page, pageSize) => {
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize,
    }));
  };

  // handle search
  const handleSearch = () => {
    getTableData();
  };

  // export table data to csv
  const exportTableData = () => {
    exportCsv(tableData, csvHeaders, 'event');
    successToast('Export CSV file successfully');
  };

  // sync table data
  const syncTableData = () => {
    getTableData();
  };

  return (
    <>
      <PageTitle title="Events" />
      <CustomCard ref={searchRef}>
        <Row gutter={[16, 16]} style={{ flexWrap: 'wrap-reverse' }}>
          <Col span={24} lg={16}>
            <Form form={form} layout="vertical" onFinish={handleSearch}>
              <Row gutter={[16, 16]} align="bottom">
                <Col span={24} lg={5}>
                  <Form.Item name="keyword" style={{ margin: 0 }}>
                    <Input size="large" placeholder="Search" allowClear />
                  </Form.Item>
                </Col>
                <Col span={24} lg={5}>
                  <Form.Item name="status" style={{ margin: 0 }}>
                    <Select placeholder="Status" size="large" allowClear>
                      {Object.values(EVENT_STATUS).map((status) => (
                        <Option value={status} key={status}>
                          {status}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={24} lg={2}>
                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    block
                    icon={<SearchOutlined />}
                  />
                </Col>
              </Row>
            </Form>
          </Col>
          <Col span={24} lg={8} style={{ textAlign: 'right' }}>
            <Space>
              <Tooltip title="Sync data">
                <Button
                  icon={<SyncOutlined />}
                  size="large"
                  onClick={syncTableData}
                />
              </Tooltip>
              <Tooltip title="Export data">
                <Button
                  icon={<CloudDownloadOutlined />}
                  size="large"
                  onClick={exportTableData}
                />
              </Tooltip>
              <Tooltip title="Import data">
                <Button icon={<CloudUploadOutlined />} size="large" disabled />
              </Tooltip>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => router.push(`${ROUTERS.EVENTS}/create`)}
              >
                Create
              </Button>
            </Space>
          </Col>
        </Row>
      </CustomCard>
      <CustomCard style={{ marginTop: '24px' }}>
        <EventsTable
          dataSource={tableData}
          pagination={pagination}
          loading={loading}
          maxHeight={maxTableHeight}
          onChange={handleTableChange}
        />
      </CustomCard>
    </>
  );
};

export default EventsPage;
