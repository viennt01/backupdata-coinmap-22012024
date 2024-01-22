import type { NextPage } from 'next';
// Chakra imports
import { Flex } from '@chakra-ui/react';
// Custom components

import React, { useState } from 'react';
import Head from 'next/head';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';
import CreateBotPage from 'components/bot/tbot/create';
import BotTradingHistory from 'components/settings/bot/detail-bot';

const UserPackage: NextPage = () => {
  const [fetchTradeHistory, setFetchTradeHistory] = useState<boolean>(true);
  const ability = useMyAbility();

  if (!ability.can('ROLE', ability.permissions.UPDATE_BOT_TRADING)) {
    return <>{NOT_PERMISSION}</>;
  }

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | EDIT</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <CreateBotPage
          editing
          setFetchTradeHistory={setFetchTradeHistory}
          fetchTradeHistory={fetchTradeHistory}
        />
        <BotTradingHistory fetchTradeHistory={fetchTradeHistory} />
      </Flex>
    </>
  );
};

export default UserPackage;
