import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateResolution from 'components/settings/resolution/create';
import useMyAbility from 'hook/ability';
import { NOT_PERMISSION } from 'constants/message';

const Resolution: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.UPDATE_RESOLUTION)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | EDIT</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateResolution editing={true} />
      </Flex>
    </>
  );
};

export default Resolution;