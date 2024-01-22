import type { ColumnsType } from 'antd/es/table';
import React, { memo } from 'react';
import { Button, Col, Row, Table, Tag, Tooltip } from 'antd';
import { EditOutlined, UsergroupDeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { formatDate } from '@/utils/format';
import { MERCHANTS_STATUS_COLOR } from '@/constants/merchants';
import { Merchant } from '@/components/affiliate/merchants/fetcher';

interface GuestsTableProps {
  dataSource: Merchant[];
  loading: boolean;
}

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading } = props;
  const router = useRouter();

  const columns: ColumnsType<Merchant> = [
    {
      title: '#',
      dataIndex: 'index',
      align: 'right',
      width: '5%',
      render: (_, record, index) => {
        return index + 1;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: '10%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '10%',
    },
    {
      title: 'Code',
      dataIndex: 'code',
      width: '10%',
    },
    {
      title: 'Domain',
      dataIndex: 'domain',
      width: '10%',
    },
    {
      title: 'Commission',
      dataIndex: 'commission',
      width: '10%',
      render: (_, record) => record.config.commission * 100 + '%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      width: '10%',

      render: (value) => (
        <Tag
          color={
            MERCHANTS_STATUS_COLOR[value as keyof typeof MERCHANTS_STATUS_COLOR]
          }
        >
          {value}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: '10%',
    },
    {
      title: 'Created at',
      dataIndex: 'created_at',
      align: 'right',
      width: '10%',

      render: (value) => formatDate(Number(value)),
    },
    {
      title: 'Updated at',
      dataIndex: 'updated_at',
      align: 'right',
      width: '10%',

      render: (value) => formatDate(Number(value)),
    },
    {
      title: '',
      dataIndex: 'action',
      fixed: 'right',
      align: 'right',
      render: (_, record) => (
        <div style={{ width: 100 }}>
          <Row gutter={8}>
            <Col span={12}>
              <Tooltip title="View users">
                <Button
                  size="large"
                  icon={<UsergroupDeleteOutlined></UsergroupDeleteOutlined>}
                  onClick={() =>
                    router.push({
                      pathname: '/affiliate/users',
                      query: {
                        merchant_code: record.code,
                      },
                    })
                  }
                ></Button>
              </Tooltip>
            </Col>
            <Col span={12}>
              <Tooltip title="Edit merchant">
                <Button
                  size="large"
                  icon={<EditOutlined />}
                  onClick={() =>
                    router.push(`/affiliate/merchants/${record.id}`)
                  }
                ></Button>
              </Tooltip>
            </Col>
          </Row>
        </div>
      ),
    },
  ];
  return (
    <>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={loading}
        scroll={{ x: 2000, y: '60vh' }}
        tableLayout="auto"
      />
    </>
  );
};
export default memo(GuestsTable);
