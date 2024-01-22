import { Tag, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { MyTd } from 'components/tables';
import { format } from 'date-fns';
import { ListResponTradeHistory } from './interface';

interface Props {
  listTradeHistory: ListResponTradeHistory;
}

function TableDetailTradingHistory(props: Props) {
  const { listTradeHistory: listTradeHistory } = props;
  const textColor = useColorModeValue('gray.700', 'white');
  let statusColor;

  switch (listTradeHistory && listTradeHistory.status) {
    case 'OPEN':
      statusColor = 'blue';
      break;
    case 'CLOSE':
      statusColor = 'gray';
      break;
    default:
      statusColor = 'gray';
  }
  const textStatusColor = useColorModeValue(statusColor, 'white');

  return (
    <Tr>
      <MyTd textAlign="center">
        <Tag variant="solid">
          {listTradeHistory.token_first} / {listTradeHistory.token_second}
        </Tag>
      </MyTd>
      <MyTd textAlign="center">
        <Tag variant="solid" colorScheme={textStatusColor}>
          {listTradeHistory.status}
        </Tag>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {listTradeHistory.side}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {listTradeHistory.entry_price}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {listTradeHistory.close_price}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {Number(listTradeHistory.profit).toFixed(2)}%
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {listTradeHistory.profit_cash}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {listTradeHistory.volume}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {format(Number(listTradeHistory.day_started), 'HH:mm dd/MM/yyyy')}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {format(Number(listTradeHistory.day_completed), 'HH:mm dd/MM/yyyy')}
        </Text>
      </MyTd>
    </Tr>
  );
}

export default TableDetailTradingHistory;
