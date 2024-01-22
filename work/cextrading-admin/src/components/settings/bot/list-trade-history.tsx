import React from 'react';
import {
  useColorModeValue,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import { MyTh } from 'components/tables';
import TableDetailTradingRow from './table-detail-trade-history';
import { listDetailBotTradingHistory } from './fetcher';
import { ListResponTradeHistory, ParamsTradingHistoryList } from './interface';
import { ERROR_CODE } from 'fetcher/interface';
import { FILTER_DEFAULT } from 'constants/index';

const initFilter: ParamsTradingHistoryList = {
  page: FILTER_DEFAULT.page,
  size: FILTER_DEFAULT.size,
  bot_id: '',
  user_id: '',
  status: '',
};

interface TransactionDetailProps {
  data: ListResponTradeHistory[];
  captions: string[];
}
const TransactionDetail = ({ captions, data }: TransactionDetailProps) => {
  const textColor = useColorModeValue('gray.700', 'white');
  return (
    <Table size={'sm'} variant="simple" color={textColor}>
      <Thead>
        <Tr whiteSpace={'nowrap'} my=".8rem" color="gray.400">
          {captions.map((caption, idx) => {
            return (
              <MyTh textAlign="center" key={idx}>
                {caption}
              </MyTh>
            );
          })}
        </Tr>
      </Thead>
      <Tbody>
        {data.length > 0 ? (
          data.map((dataHistory: ListResponTradeHistory) => {
            return (
              <TableDetailTradingRow
                key={dataHistory.id}
                listTradeHistory={dataHistory}
              />
            );
          })
        ) : (
          <Tr>
            <Td textAlign={'center'} color="gray.400" colSpan={captions.length}>
              No Data
            </Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
};
interface props {
  fetchTradeHistory: boolean;
}

const ListTradeHistory = ({ fetchTradeHistory }: props): JSX.Element => {
  const router = useRouter();
  const bg = useColorModeValue('white', 'gray.700');

  const [dataHistoryTrade, setDataHistoryTrade] = useState<
    ListResponTradeHistory[] | null
  >(null);

  const fetchData = () => {
    const id = router.query.id;
    if (typeof id !== 'string') return;

    const rawFilter: ParamsTradingHistoryList = {
      page: initFilter.page,
      size: initFilter.size,
      bot_id: id || '',
      user_id: '',
      status: initFilter.status,
    };
    listDetailBotTradingHistory(rawFilter).then((rawRes) => {
      if (rawRes.error_code === ERROR_CODE.SUCCESS) {
        setDataHistoryTrade(rawRes.payload?.rows);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [router, fetchTradeHistory]);

  return (
    <div>
      <Card p="5px" bg={bg} overflowX={{ sm: 'scroll' }}>
        <CardBody maxHeight="400px" m="5px"></CardBody>
        <TransactionDetail
          captions={[
            'Pair',
            'Status',
            'Side',
            'Entry Price',
            'Close Price',
            'Profit/Loss',
            'Profit Cash',
            'Volumn',
            'Started',
            'Completed',
          ]}
          data={dataHistoryTrade || []}
        />
      </Card>
    </div>
  );
};

export default ListTradeHistory;
