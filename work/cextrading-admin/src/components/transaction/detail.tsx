import { Box, Heading } from '@chakra-ui/layout';
import {
  Grid,
  useColorModeValue,
  Text,
  Flex,
  Textarea,
  Button,
} from '@chakra-ui/react';
import BackButton from 'components/back-btn';
import Card from 'components/card/card';
import CardBody from 'components/card/card-body';
import CardHeader from 'components/card/card-header';
import { ERROR_CODE } from 'fetcher/interface';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  getTransaction,
  normalizeTransaction,
  listTransactionLog,
  normalizeTransactionLog,
  checkTransaction,
  normalizeCheckTransaction,
} from './fetcher';
import { CheckTransaction, Transaction, TransactionLog } from './interface';
const TransactionDataDetail = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [transactionLogs, setTransactionLogs] = useState<
    TransactionLog[] | null
  >(null);
  const [checkTransactionData, setCheckTransactionData] =
    useState<CheckTransaction | null>(null);
  const fetchData = () => {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    getTransaction(id).then((rawRes) => {
      if (rawRes.error_code === ERROR_CODE.SUCCESS) {
        const res = normalizeTransaction(rawRes.payload);
        setTransaction(res);
      }
    });
    listTransactionLog(id).then((rawRes) => {
      if (rawRes.error_code === ERROR_CODE.SUCCESS) {
        const res = normalizeTransactionLog(rawRes.payload);
        setTransactionLogs(res);
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, [router]);

  function onCheckTransaction() {
    const id = router.query.id;
    if (typeof id !== 'string') return;
    checkTransaction(id).then((rawRes) => {
      if (rawRes.error_code === ERROR_CODE.SUCCESS) {
        const res = normalizeCheckTransaction(rawRes.payload);
        setCheckTransactionData(res);
      }
    });
  }
  const bg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
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
                      Wallet Address:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.walletAddress}
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
                      Sell Amount:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.sellAmount || 0} {transaction.sellCurrency}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Buy Amount:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.buyAmount || 0} {transaction.buyCurrency}
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
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.status}
                    </Text>
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
                      {transaction.firstName} {transaction.lastName}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Mobile:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transaction.phone}
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
      {transaction && transaction.details && (
        <Box bg={bg} p="20px" borderRadius={15} mt="20px">
          <Text
            pl="10px"
            fontSize="lg"
            color={textColor}
            fontWeight="bold"
            me="10px"
          >
            Upgrade plan
          </Text>
          {transaction.details.map((transDetail, index) => {
            return (
              <Grid
                key={index}
                templateColumns={{ sm: '1fr', xl: 'repeat(2, 1fr)' }}
                gap="22px"
              >
                <Card p="16px" my={{ sm: '24px', xl: '0px' }}>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Role name:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transDetail.roleName}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Price:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transDetail.price} {transDetail.currency}
                    </Text>
                  </Flex>
                </Card>
                <Card p="16px" my={{ sm: '24px', xl: '0px' }}>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Package Time:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transDetail.packageName}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Expires Time:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {transDetail.expiresAt}
                    </Text>
                  </Flex>
                </Card>
              </Grid>
            );
          })}
        </Box>
      )}
      <Card
        bg={bg}
        borderRadius={15}
        p="40px"
        overflowX={{ sm: 'scroll' }}
        mt="20px"
      >
        <CardHeader p="6px 0px 22px 0px">
          <Text fontSize="xl" color={textColor} fontWeight="bold">
            Transaction Logs
          </Text>
          <Button
            ml={10}
            colorScheme="teal"
            bg="teal.300"
            onClick={onCheckTransaction}
          >
            Check transaction
          </Button>
        </CardHeader>
        {checkTransactionData && (
          <CardBody
            maxHeight="400px"
            overflow="auto"
            border="2px solid orange;"
            borderRadius="10px"
            p="10px"
            m="5px"
          >
            <Flex direction="column">
              <Flex align="center" mb="18px">
                <Text
                  fontSize="md"
                  color={textColor}
                  fontWeight="bold"
                  me="10px"
                >
                  Transaction Event:{' '}
                </Text>
                <Text fontSize="md" color="gray.500" fontWeight="400">
                  {checkTransactionData.transactionEvent} (Check transaction)
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
                <Text fontSize="md" color="gray.500" fontWeight="400">
                  {checkTransactionData.transactionStatus}
                </Text>
              </Flex>
              <Flex align="center" mb="18px">
                <Text
                  fontSize="md"
                  color={textColor}
                  fontWeight="bold"
                  me="10px"
                >
                  Time:{' '}
                </Text>
                <Text fontSize="md" color="gray.500" fontWeight="400">
                  {checkTransactionData.createdAt}
                </Text>
              </Flex>
              <Flex align="center" mb="18px">
                <Text
                  fontSize="md"
                  color={textColor}
                  fontWeight="bold"
                  me="10px"
                >
                  Metadata:{' '}
                </Text>
                <Textarea
                  disabled
                  cols={90}
                  rows={5}
                  value={JSON.stringify(
                    checkTransactionData.metadata,
                    undefined,
                    2,
                  )}
                  size="lg"
                />
              </Flex>
            </Flex>
          </CardBody>
        )}
        {transactionLogs &&
          transactionLogs.map((log: TransactionLog) => {
            return (
              <CardBody
                key={log.id}
                maxHeight="400px"
                overflow="auto"
                border="2px solid #81E6D9;"
                borderRadius="10px"
                p="10px"
                m="5px"
              >
                <Flex direction="column">
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Transaction Event:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {log.transactionEvent}
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
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {log.transactionStatus}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Time:{' '}
                    </Text>
                    <Text fontSize="md" color="gray.500" fontWeight="400">
                      {log.createdAt}
                    </Text>
                  </Flex>
                  <Flex align="center" mb="18px">
                    <Text
                      fontSize="md"
                      color={textColor}
                      fontWeight="bold"
                      me="10px"
                    >
                      Metadata:{' '}
                    </Text>
                    <Textarea
                      disabled
                      cols={90}
                      rows={5}
                      value={JSON.stringify(log.metadata, undefined, 2)}
                      size="lg"
                    />
                  </Flex>
                </Flex>
              </CardBody>
            );
          })}
      </Card>
    </>
  );
};
export default TransactionDataDetail;
