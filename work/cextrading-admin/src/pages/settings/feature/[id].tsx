import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import CreateFeature from 'components/settings/feature/create';
import useMyAbility from 'hook/ability';
import { NOT_PERMISSION } from 'constants/message';

const Feature: NextPage = () => {
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.UPDATE_FEATURE)) {
    return <>{NOT_PERMISSION}</>;
  }
  return (
    <>
      <Head>
        <title>COINMAP ADMIN | EDIT</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateFeature editing={true} />
      </Flex>
    </>
  );
};

export default Feature;