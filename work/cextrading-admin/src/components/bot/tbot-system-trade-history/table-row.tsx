import { Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { TBotSystemTradeHistory } from './interface';
import { MyTd } from 'components/tables';
interface Props {
  trade: TBotSystemTradeHistory;
}

function TableTBotSystemTradeHistoryRow(props: Props) {
  const { trade } = props;
  const textColor = useColorModeValue('gray.700', 'white');
  return (
    <Tr>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.nameBot}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.clientId}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.orderId}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.type}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.positionSide || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.size || 0}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.symbol}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.resolution}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.openPrice}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.closePrice}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.openTime}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {trade.closeTime}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.stopLost}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.takeProfit}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.profit}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.swap}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.commission}
        </Text>
      </MyTd>
      <MyTd>
        <Text textAlign="left" color={textColor} fontWeight="bold">
          {trade.comment}
        </Text>
      </MyTd>
    </Tr>
  );
}

export default TableTBotSystemTradeHistoryRow;
