import { Tag, Text, Tr, useColorModeValue } from '@chakra-ui/react';
import React from 'react';
import { Transaction } from './fetcher';
import { MyTd } from 'components/tables';
import { format } from 'date-fns';

interface Props {
  transaction: Transaction;
}

function TableTransactionDetailRow(props: Props) {
  const { transaction: transaction } = props;
  const textColor = useColorModeValue('gray.700', 'white');

  let statusColor;

  switch (transaction && transaction.status) {
    case 'ACTIVE':
      statusColor = 'blue';
      break;
    case 'PROCESSING':
      statusColor = 'orange';
      break;
    case 'INACTIVE':
      statusColor = 'red';
      break;
    default:
      statusColor = 'gray';
  }
  const textStatusColor = useColorModeValue(statusColor, 'white');

  return (
    <Tr>
      <MyTd textAlign="center">
        <Tag variant="solid">{transaction.name}</Tag>
      </MyTd>
      <MyTd textAlign="center">
        <Tag variant="solid" colorScheme={textStatusColor}>
          {transaction.status}
        </Tag>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {transaction.price}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {transaction.quantity}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {format(Number(transaction.expires_at), 'HH:mm dd/MM/yyyy')}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {format(Number(transaction.updated_at), 'HH:mm dd/MM/yyyy')}
        </Text>
      </MyTd>
    </Tr>
  );
}

export default TableTransactionDetailRow;
