import type { TablePaginationConfig } from 'antd/es/table';
import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useMemo,
} from 'react';
import { Button, Col, Form, PaginationProps, Row, Space, Tooltip } from 'antd';
import GuestsTable from './guests-table';
import PageTitle from '@/components/commons/page-title';
import CustomCard from '@/components/commons/custom-card';
import { exportCsv } from '@/utils/common';
import {
  getGuestList,
  getEventList,
  bulkCreateGuest,
  AdminListUserOutput,
  AdminGetUserDataOutput,
  AdminListEventOutput,
  AdminInviteEventCSVOutput,
} from '@/utils/api-getters';
import { ERROR_CODE, DEFAULT_PAGINATION } from '@/constants/code-constants';
import { errorToast, successToast } from '@/hook/toast';
import { URLS } from '@/constants/urls';
import ErrorLogModal from './error-log-modal';
import { useRouter } from 'next/router';
import {
  CloudDownloadOutlined,
  CloudUploadOutlined,
  SyncOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import Filter, { FilterProps } from './filter';
import ImportCSVModal from './import-csv-modal';
import { ROUTERS } from '@/constants/router';
const MIN_TABLE_HEIGHT = 300;

interface OptionSelect {
  label: string;
  value: string;
}

export interface ImportCSVFormValues {
  event_id: string;
  file: FileList;
}

export interface LogType {
  index: string;
  email: string;
  message: string;
}

const GuestsPage = () => {
  const router = useRouter();
  const [tableData, setTableData] = useState<AdminGetUserDataOutput[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>(() => {
    const { page, pageSize } = router.query;
    const pagination = {
      ...DEFAULT_PAGINATION,
    };
    if (page) {
      pagination.current = Number(page);
    }
    if (pageSize) {
      pagination.pageSize = Number(pageSize);
    }
    return pagination;
  });
  const [maxTableHeight, setMaxTableHeight] = useState(MIN_TABLE_HEIGHT);
  const searchRef = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm<FilterProps>();
  const [eventOptions, setEventOptions] = useState<OptionSelect[]>([]);
  const [openImportModal, setOpenImportModal] = useState(false);
  const [loadingImport, setLoadingImport] = useState(false);
  const [openErrorLogModal, setOpenErrorLogModal] = useState(false);
  const [errorLogs, setErrorLogs] = useState<LogType[]>([]);

  const csvHeaders = useMemo(
    () => [
      {
        name: 'Name',
        value: 'fullname',
      },
      {
        name: 'Email',
        value: 'email',
      },
      {
        name: 'Phone',
        value: 'phone',
        converter: (value: string) => (value ? `'${value}` : ''),
      },
      {
        name: 'Telegram',
        value: 'telegram',
      },
      {
        name: 'Event',
        value: 'event_id',
        converter: (value: string) =>
          eventOptions.find((item) => item.value === value)?.label ?? '',
      },
      {
        name: 'Invite code',
        value: 'invite_code',
      },
      {
        name: 'Confirm status',
        value: 'confirm_status',
      },
      {
        name: 'Payment status',
        value: 'payment_status',
      },
      {
        name: 'Attend',
        value: 'attend',
        converter: (value: boolean) => (value ? 'YES' : 'NO'),
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
    ],
    [eventOptions]
  );

  useEffect(() => {
    // get all events to create event options
    getEventList('?page=1&size=9999999')
      .then((res: AdminListEventOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          const eventOptions = res.payload.rows.map((record) => ({
            label: record.name,
            value: record.id,
          }));
          setEventOptions(eventOptions);
        }
      })
      .catch((e: Error) => console.log(e));
  }, []);

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
  // need the resetPage field to reset when filtering
  const getTableData = (resetPage?: boolean) => {
    setLoading(true);
    const { current, pageSize } = pagination;
    let queryParams = `?page=${resetPage ? 1 : current}&size=${pageSize}`;
    const formValues = form.getFieldsValue();
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key as keyof FilterProps];
      if (value) queryParams += `&${key}=${value}`;
    });
    getGuestList(queryParams)
      .then((res: AdminListUserOutput) => {
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

  // get all data to export to csv file
  const getAllData = () => {
    const { total } = pagination;
    let queryParams = `?page=${1}&size=${total}`;
    const formValues = form.getFieldsValue();
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key as keyof FilterProps];
      if (value) queryParams += `&${key}=${value}`;
    });
    return getGuestList(queryParams)
      .then((res: AdminListUserOutput) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          return res.payload.rows;
        }
      })
      .catch((e: Error) => console.log(e));
  };

  useEffect(() => {
    getTableData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pagination)]);

  // update pagination
  const handleTableChange: PaginationProps['onChange'] = (page, pageSize) => {
    router.replace({
      pathname: ROUTERS.GUESTS,
      query: {
        ...router.query,
        page,
        pageSize,
      },
    });
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize,
    }));
  };

  // handle search
  const handleSearch = () => {
    const resetPage = true;
    getTableData(resetPage);
    const formValues = form.getFieldsValue();
    router.replace({
      pathname: ROUTERS.GUESTS,
      query: {
        ...router.query,
        ...formValues,
        page: 1,
      },
    });
  };

  useEffect(() => {
    const { keyword, event_id, type, confirm_status, attend, payment_status } =
      router.query;
    form.setFieldsValue({
      keyword: (keyword as string) || undefined,
      event_id: (event_id as string) || undefined,
      type: (type as string) || undefined,
      confirm_status: (confirm_status as string) || undefined,
      attend: (attend as string) || undefined,
      payment_status: (payment_status as string) || undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // export table data to csv
  const exportTableData = async () => {
    setExportLoading(true);
    getAllData()
      .then((data) => {
        exportCsv(data, csvHeaders, 'guest');
        successToast('Export CSV file successfully');
      })
      .finally(() => {
        setExportLoading(false);
      });
  };

  // import table data from csv
  const importTableData = () => {
    setOpenImportModal(true);
  };

  // sync table data
  const syncTableData = () => {
    const resetPage = true;
    getTableData(resetPage);
  };

  // import table data from csv
  const confirmImportTableData = async (formValues: ImportCSVFormValues) => {
    setLoadingImport(true);
    const _requestData = new FormData();
    _requestData.append('callback_confirm_url', URLS.CALLBACK_CONFIRM_URL);
    _requestData.append('callback_attend_url', URLS.CALLBACK_ATTEND_URL);
    _requestData.append('event_id', formValues.event_id);
    _requestData.append('file', formValues.file[0]);
    bulkCreateGuest(_requestData)
      .then((res: AdminInviteEventCSVOutput) => {
        if (res.error_code !== ERROR_CODE.SUCCESS) {
          return errorToast('Failed to import CSV file');
        }
        successToast('Import CSV file successfully');
        syncTableData();

        // show error logs
        if (res.payload.length > 0) {
          setErrorLogs(res.payload);
          setOpenErrorLogModal(true);
        }
      })
      .catch((e: Error) => {
        console.log(e);
        errorToast('Failed to import CSV file');
      })
      .finally(() => {
        setLoadingImport(false);
        setOpenImportModal(false);
      });
  };

  const cancelImportTableData = () => {
    setOpenImportModal(false);
  };

  return (
    <>
      <PageTitle title="Guests" />
      <div ref={searchRef}>
        <CustomCard>
          <Filter
            form={form}
            handleSearch={handleSearch}
            eventOptions={eventOptions}
          />
        </CustomCard>
        <div style={{ marginTop: '24px' }}>
          <Row>
            <Col span={24} lg={24} style={{ textAlign: 'right' }}>
              <Space>
                <Tooltip title="Sync data">
                  <Button
                    icon={<SyncOutlined />}
                    size="large"
                    onClick={syncTableData}
                  />
                </Tooltip>
                <Tooltip title="Export all data">
                  <Button
                    loading={exportLoading}
                    icon={<CloudDownloadOutlined />}
                    size="large"
                    onClick={exportTableData}
                  />
                </Tooltip>
                <Tooltip title="Import data">
                  <Button
                    icon={<CloudUploadOutlined />}
                    size="large"
                    onClick={importTableData}
                  />
                </Tooltip>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  size="large"
                  onClick={() => router.push(`${ROUTERS.GUESTS}/create`)}
                >
                  Create
                </Button>
              </Space>
            </Col>
          </Row>
        </div>
      </div>
      <CustomCard style={{ marginTop: '24px' }}>
        <GuestsTable
          dataSource={tableData}
          pagination={pagination}
          loading={loading}
          maxHeight={maxTableHeight}
          onChange={handleTableChange}
          eventOptions={eventOptions}
        />
      </CustomCard>
      <ImportCSVModal
        loading={loadingImport}
        open={openImportModal}
        eventOptions={eventOptions}
        handleOk={confirmImportTableData}
        handleCancel={cancelImportTableData}
      />
      <ErrorLogModal
        open={openErrorLogModal}
        errorLogs={errorLogs}
        handleOk={() => setOpenErrorLogModal(false)}
        handleCancel={() => setOpenErrorLogModal(false)}
      />
    </>
  );
};

export default GuestsPage;
