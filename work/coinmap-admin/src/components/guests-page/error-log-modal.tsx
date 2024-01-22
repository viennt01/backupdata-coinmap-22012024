import { Button, Modal, PaginationProps, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { LogType } from './index';
import type { TablePaginationConfig } from 'antd/es/table';

interface ErrorLogModalProps {
  open: boolean;
  errorLogs: LogType[];
  handleOk: () => void;
  handleCancel: () => void;
}

const columns: ColumnsType<LogType> = [
  {
    title: 'Index',
    dataIndex: 'index',
    align: 'right',
    width: '60px',
    defaultSortOrder: 'ascend',
    sorter: ({ index: a }, { index: b }) => Number(a) - Number(b),
    render: (value) => <div style={{ color: 'red' }}>{value}</div>,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    width: '60%',
    render: (value) => <div style={{ color: 'red' }}>{value}</div>,
  },
  {
    title: 'Message',
    dataIndex: 'message',
    width: '30%',
    render: (value) => <div style={{ color: 'red' }}>{value}</div>,
  },
];

const ErrorLogModal: React.FC<ErrorLogModalProps> = ({
  open,
  errorLogs,
  handleOk,
  handleCancel,
}) => {
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    if (!open) return;
    setPagination((state) => ({
      ...state,
      current: 1,
      pageSize: 10,
      total: errorLogs.length,
    }));
  }, [open, errorLogs.length]);

  const onOke = () => handleOk();

  const onCancel = () => handleCancel();

  // update pagination
  const handleTableChange: PaginationProps['onChange'] = (page, pageSize) => {
    setPagination((state) => ({
      ...state,
      current: page,
      pageSize,
    }));
  };

  return (
    <Modal
      centered
      title="Import CSV file error logs"
      open={open}
      onOk={onOke}
      onCancel={onCancel}
      maskClosable={false}
      width={'90vw'}
      style={{ margin: '24px', maxWidth: 1000 }}
      footer={[
        <Button key="submit" type="primary" onClick={onOke}>
          Ok
        </Button>,
      ]}
    >
      <Table
        rowKey={(record) => record.index}
        columns={columns}
        dataSource={errorLogs}
        size="small"
        scroll={{ x: 680, y: '60vh' }}
        tableLayout="auto"
        pagination={{
          responsive: true,
          style: { marginBottom: '0' },
          ...pagination,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
          onChange: handleTableChange,
        }}
      />
    </Modal>
  );
};

export default ErrorLogModal;
