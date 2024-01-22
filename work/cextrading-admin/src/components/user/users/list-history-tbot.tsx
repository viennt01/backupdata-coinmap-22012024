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
import TableTransactionDetailRow from './table-detail-row';
import { Transaction, getTransactionDetail } from './fetcher';

interface TransactionDetailProps {
  data: Transaction[];
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
          data.map((transaction: Transaction) => {
            return (
              <TableTransactionDetailRow
                key={transaction.id}
                transaction={transaction}
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

const ListSBot = (): JSX.Element => {
  const router = useRouter();

  const bg = useColorModeValue('white', 'gray.700');

  const [dataHistoryRole, setDataHistoryRole] = useState<Transaction[] | null>(
    null,
  );

  const fetchData = () => {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    getTransactionDetail(id, 'TBOT').then((rawRes) => {
      setDataHistoryRole(rawRes.payload.rows);
    });
  };
  useEffect(() => {
    fetchData();
  }, [router]);

  return (
    <div>
      <Card p="5px" bg={bg} overflowX={{ sm: 'scroll' }}>
        <CardBody maxHeight="400px" m="5px"></CardBody>
        <TransactionDetail
          captions={[
            'Name',
            'Status',
            'Price',
            'Quantity',
            'Expires at',
            'Updated at',
          ]}
          data={dataHistoryRole || []}
        />
      </Card>
    </div>
  );
};

export default ListSBot;
