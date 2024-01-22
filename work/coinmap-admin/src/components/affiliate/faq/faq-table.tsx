import type { ColumnsType } from 'antd/es/table';
import React, { memo, useMemo } from 'react';
import { Button, Table, Tooltip } from 'antd';
import {
  EditOutlined,
  MinusCircleTwoTone,
  PlusCircleTwoTone,
} from '@ant-design/icons';
import { formatDate } from '@/utils/format';
import { FAQ } from './interface';
import { useRouter } from 'next/router';
import { ROUTERS } from '@/constants/router';

interface GuestsTableProps {
  dataSource: FAQ[];
  loading: boolean;
}

const GuestsTable: React.FC<GuestsTableProps> = (props) => {
  const { dataSource, loading } = props;
  const router = useRouter();

  const columns: ColumnsType<FAQ> = useMemo(
    () => [
      {
        title: 'FAQ',
        dataIndex: ['data', 'translation', 'en', 'name'],
        width: '10%',
      },
      {
        title: 'FAQ',
        dataIndex: ['data', 'translation', 'vi', 'name'],
        width: '10%',
      },
      {
        title: 'Order',
        dataIndex: ['data', 'translation', 'vi', 'order'],
        width: '10%',
        align: 'center',
      },
      {
        title: 'Created at',
        dataIndex: 'created_at',
        align: 'right',
        width: '10%',

        render: (value: FAQ['created_at']) => formatDate(Number(value)),
      },
      {
        title: '',
        dataIndex: 'action',
        fixed: 'right',
        align: 'center',
        width: '1%',
        render: (_: FAQ, record: FAQ) => (
          <Tooltip title="Update FAQ">
            <Button
              onClick={() =>
                router.push(`${ROUTERS.AFFILIATE_FAQ}/${record.id}`)
              }
              icon={
                <EditOutlined style={{ cursor: 'pointer', fontSize: '18px' }} />
              }
            ></Button>
          </Tooltip>
        ),
      },
    ],
    []
  );
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
        expandable={{
          columnWidth: '1%',
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <MinusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ) : (
              <PlusCircleTwoTone onClick={(e) => onExpand(record, e)} />
            ),
          expandedRowRender: (record) => (
            <div>
              <div>
                <div>EN:</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: record.data.translation.vi.answer,
                  }}
                />
                <div>VI:</div>
                <div
                  dangerouslySetInnerHTML={{
                    __html: record.data.translation.en.answer,
                  }}
                />
              </div>
            </div>
          ),
          fixed: true,
          rowExpandable: (record) => Boolean(record.name),
        }}
      />
    </>
  );
};
export default memo(GuestsTable);
