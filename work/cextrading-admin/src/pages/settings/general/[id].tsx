import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateGeneral from 'components/settings/general/create';
import useMyAbility from 'hook/ability';
import { NOT_PERMISSION } from 'constants/message';

const General: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.UPDATE_GENERAL_SETTING)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | EDIT</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateGeneral editing={true} />
      </Flex>
    </>
  );
};

export default General;
