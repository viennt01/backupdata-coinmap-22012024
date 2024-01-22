import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';
import TransactionDetail from 'components/transaction/detail';

const Transaction: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.GET_TRANSACTION)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | TRANSACTION DETAIL</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <TransactionDetail />
      </Flex>
    </>
  );
};

export default Transaction;
