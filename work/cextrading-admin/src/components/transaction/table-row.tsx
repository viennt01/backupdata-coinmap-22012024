import { Text, Tr, useColorModeValue } from '@chakra-ui/react';
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

  return (
    <Tr>
      <MyTd>
        <Text
          borderBottom="1px solid blue"
          cursor="pointer"
          color="blue"
          fontWeight="bold"
          onClick={handleTransactionDetail}
        >
          {transaction.paymentId}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {transaction.sellAmount || 0} {transaction.sellCurrency}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {transaction.buyAmount || 0} {transaction.buyCurrency}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textStatusColor} fontWeight="bold">
          {transaction.status}
        </Text>
      </MyTd>
      <MyTd>
        <Text color={textColor} fontWeight="bold">
          {transaction.firstName} {transaction.lastName}
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
