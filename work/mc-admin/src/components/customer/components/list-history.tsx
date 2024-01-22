import { ERROR_CODE } from '@/constant/error-code';
import { Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { getListHistory } from '../fetcher';
import { HistoryOfCustomer } from '../interface';
import { formatDateTime } from '@/utils/format';

const { Title } = Typography;

export default function ListHistory() {
  const router = useRouter();
  const [botListHistory, setBotListHistory] = useState<HistoryOfCustomer[]>([]);

  const { id } = router.query;

  const fetchListBotOfCustomer = () => {
    getListHistory(id as string)
      .then((res) => {
        if (res.error_code === ERROR_CODE.SUCCESS) {
          setBotListHistory(res.payload);
        }
      })
      .catch((e: Error) => {
        console.log(e);
        router.push('/customer/list');
      });
  };

  useEffect(() => {
    if (!id) return;
    fetchListBotOfCustomer();
  }, [id]);

  const columns: ColumnsType<HistoryOfCustomer> = useMemo(
    () => [
      {
        title: 'Id',
        dataIndex: 'bot_id',
      },
      {
        title: 'Name',
        dataIndex: 'bot_name',
      },
      {
        title: 'Trade Id',
        dataIndex: 'trade_id',
      },
      {
        title: 'Symbol',
        dataIndex: 'symbol',
      },
      {
        title: 'Time',
        dataIndex: 'time',
        align: 'right',
        render: (value) => formatDateTime(new Date(Number(value))),
      },
    ],
    []
  );

  return (
    <>
      <Title
        style={{
          marginBottom: 24,
          textAlign: 'center',
        }}
        level={3}
      >
        Invalid A.I Trading
      </Title>
      <Table
        style={{
          marginBottom: 24,
        }}
        bordered
        dataSource={botListHistory}
        columns={columns}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </>
  );
}
