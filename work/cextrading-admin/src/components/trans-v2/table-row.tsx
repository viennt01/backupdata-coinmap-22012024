import { Text, Tr, useColorModeValue, Tag, Badge } from '@chakra-ui/react';
import React from 'react';
import { Transaction, TRANSACTION_STATUS } from './interface';
import { MyTd } from 'components/tables';
interface Props {
  transaction: Transaction;
  handleTransactionDetail: () => void;
}

function TableTransactionRow(props: Props) {
  const { transaction, handleTransactionDetail } = props;
  const textColor = useColorModeValue('gray.700', 'white');
  let statusColor;

  switch (transaction.status) {
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
  const bgStatus = useColorModeValue('teal.300', '#1a202c');
  const textBadgeColor = useColorModeValue('gray.700', 'white');

  return (
    <Tr>
      <MyTd>
        <Text
          textDecoration="underline"
          cursor="pointer"
          color="blue"
          fontWeight="bold"
          onClick={handleTransactionDetail}
        >
          {transaction.orderId}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {transaction.amount || 0}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {transaction.merchantCode}
        </Text>
      </MyTd>
      <MyTd textAlign="center">
        <Text color={textColor} fontWeight="bold">
          {transaction.category}
        </Text>
      </MyTd>
      <MyTd textAlign="left">
        {transaction.name.map((r: { id: React.Key; name: string }) => (
          <Badge
            key={r.id}
            p="5px 10px"
            mx="5px"
            borderRadius="8px"
            bg={bgStatus}
            color={textBadgeColor}
          >
            {r.name}
          </Badge>
        ))}
      </MyTd>
      <MyTd textAlign="center">
        <Tag variant="solid" colorScheme={textStatusColor}>
          {transaction.status}
        </Tag>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {transaction.fullname}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {transaction.email}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {transaction.createdAt}
        </Text>
      </MyTd>
    </Tr>
  );
}

export default TableTransactionRow;
