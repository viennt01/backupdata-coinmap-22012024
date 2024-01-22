import { Box, Heading } from '@chakra-ui/layout';
import {
  Grid,
  useColorModeValue,
  Text,
  Flex,
  Textarea,
  Button,
  Tag,
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  HStack,
  ListItem,
  OrderedList,
  ListIcon,
} from '@chakra-ui/react';
import BackButton from 'components/back-btn';
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';
import { MyTh } from 'components/tables';
import { ERROR_CODE } from 'fetcher/interface';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  getTransactionDetail,
  normalizeTransaction,
  normalizeTransactionLog,
  normalizeMetadatas,
} from './fetcher';
import { HiOutlineCalendar, HiOutlineCurrencyDollar } from 'react-icons/hi';

import { Log, Metadata, Transaction, TRANSACTION_STATUS } from './interface';
import TableTransactionDetailRow from './table-detail-row';

interface TransactionDetailLogsProps {
  handleShowDetail: (log: Log) => void;
  data: Log[];
  captions: string[];
}

const TransactionDetailLogs = ({
  captions,
  data,
  handleShowDetail,
}: TransactionDetailLogsProps) => {
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
          data.map((log: Log) => {
            return (
              <TableTransactionDetailRow
                handleShowDetail={() => handleShowDetail(log)}
                key={log.id}
                log={log}
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

const TransactionDataDetail = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [transactionLogs, setTransactionLogs] = useState<Log[] | null>(null);
  const [metadatas, setMetadatas] = useState<Metadata[] | null>(null);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [metadataLog, setMetadataLog] = useState<Log | null>(null);

  const fetchData = () => {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    getTransactionDetail(id).then((rawRes) => {
      if (rawRes.error_code === ERROR_CODE.SUCCESS) {
        const transaction = normalizeTransaction(rawRes.payload.transaction);
        const logs = normalizeTransactionLog(rawRes.payload.logs);
        const metadatas = normalizeMetadatas(rawRes.payload.metadatas);
        setTransaction(transaction);
        setTransactionLogs(logs);
        setMetadatas(metadatas);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [router]);

  const handleShowDetail = (log: Log) => {
    setMetadataLog(log);
    setOpenModal(true);
  };

  const bg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');

  let statusColor;

  switch (transaction && transaction.status) {
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
    <>
      <BackButton label="Transaction listing" />
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          Transaction detail
        </Heading>
        {transaction && (
          <Grid
            templateColumns={{ sm: '1fr', xl: 'repeat(2, 1fr)' }}
            gap="22px"
          >
            <Card p="16px" my={{ sm: '24px', xl: '0px' }}>
              <CardHeader p="12px 5px" mb="12px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  Transaction information
                </Text>
              </CardHeader>
              <CardBody px="5px">
                <Flex direction="column">
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Transaction ID:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.id}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Payment ID:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.paymentId}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Order Id:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.orderId}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Order Type:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.category}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Payment Method:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.paymentMethod}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Amount:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.amount || 0}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Currency:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.currency}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Transaction Status:{' '}
                    </Text>
                    <Tag variant="solid" colorScheme={textStatusColor}>
                      {transaction.status}
                    </Tag>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Last Time:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.updatedAt}
                    </Text>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
            <Card p="16px" my={{ sm: '24px', xl: '0px' }}>
              <CardHeader p="12px 5px" mb="12px">
                <Text fontSize="lg" color={textColor} fontWeight="bold">
                  User information
                </Text>
              </CardHeader>
              <CardBody px="5px">
                <Flex direction="column">
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Full Name:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.fullname}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Email:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.email}
                    </Text>
                  </Flex>
                </Flex>
              </CardBody>
            </Card>
          </Grid>
        )}
      </Box>
      <Card p="40px" bg={bg} mt="20px" borderRadius={15}>
        <CardHeader>
          <Text fontSize="xl" mb={'20px'} color={textColor} fontWeight="bold">
            Metadatas
          </Text>
        </CardHeader>
        <CardBody maxHeight="400px" overflow="auto">
          <Flex direction="column" width="full">
            {metadatas &&
              metadatas.map((metadata, index) => {
                if (metadata.attribute === 'items') {
                  return (
                    <HStack
                      key={index}
                      width="full"
                      mb="20px"
                      alignItems="flex-start"
                    >
                      <Text
                        minWidth={200}
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        me="10px"
                      >
                        {metadata.attribute}
                      </Text>
                      <OrderedList stylePosition="inside" styleType="">
                        {JSON.parse(metadata.value).map((item: any) => (
                          <ListItem key={item.id} fontWeight="bold">
                            {item.name} -{' '}
                            <ListIcon
                              as={HiOutlineCurrencyDollar}
                              marginRight={0}
                              width="20px"
                              height="20px"
                            />
                            {item.price} -{' '}
                            <ListIcon
                              width="20px"
                              height="20px"
                              marginRight={0}
                              as={HiOutlineCalendar}
                            />
                            {item.quantity} {item.type}
                          </ListItem>
                        ))}
                      </OrderedList>
                    </HStack>
                  );
                } else {
                  return (
                    <HStack key={index} width="full" mb="20px">
                      <Text
                        minWidth={200}
                        fontSize="md"
                        color={textColor}
                        fontWeight="bold"
                        me="10px"
                      >
                        {metadata.attribute}
                      </Text>
                      <Text size="lg">{metadata.value}</Text>
                    </HStack>
                  );
                }
              })}
          </Flex>
        </CardBody>
      </Card>

      <Card
        p="40px"
        bg={bg}
        overflowX={{ sm: 'scroll' }}
        mt="20px"
        borderRadius={15}
      >
        <CardHeader>
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Transaction Logs
          </Text>
        </CardHeader>
        <CardBody maxHeight="400px" m="5px"></CardBody>
        <TransactionDetailLogs
          captions={[
            'Transaction Event',
            'Transaction Status',
            'Time',
            'Action',
          ]}
          data={transactionLogs || []}
          handleShowDetail={handleShowDetail}
        />
      </Card>

      <Modal
        size="4xl"
        isCentered
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Metadata</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align="center" mb="18px">
              <Textarea
                isReadOnly
                rows={20}
                value={
                  metadataLog
                    ? JSON.stringify(metadataLog.metadata, undefined, 2)
                    : ''
                }
                size="lg"
              />
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={() => setOpenModal(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default TransactionDataDetail;
