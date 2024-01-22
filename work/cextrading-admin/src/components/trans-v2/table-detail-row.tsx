import { Tag, Text, Tr, useColorModeValue, Button } from '@chakra-ui/react';
import React from 'react';
import { Log, TRANSACTION_STATUS } from './interface';
import { MyTd } from 'components/tables';

interface Props {
  log: Log;
  handleShowDetail: () => void;
}

function TableTransactionDetailRow(props: Props) {
  const { log, handleShowDetail } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  let statusColor;

  switch (log && log.transactionStatus) {
    case TRANSACTION_STATUS.CREATED:
      statusColor = 'blue';
      break;
    case TRANSACTION_STATUS.COMPLETE:
      statusColor = 'green';
      break;
    case TRANSACTION_STATUS.PROCESSING:
      statusColor = 'orange';
      break;
    case TRANSACTION_STATUS.FAILED:
      statusColor = 'red';
      break;
    default:
      statusColor = 'gray.700';
  }
  const textStatusColor = useColorModeValue(statusColor, 'white');

  return (
    <Tr>
      <MyTd textAlign="center">
        <Tag variant="solid">{log.transactionEvent}</Tag>
      </MyTd>
      <MyTd textAlign="center">
        <Tag variant="solid" colorScheme={textStatusColor}>
          {log.transactionStatus}
        </Tag>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {log.createdAt}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Button colorScheme="blue" mr={3} onClick={handleShowDetail}>
          Metadata
        </Button>
      </MyTd>
    </Tr>
  );
}

export default TableTransactionDetailRow;
