import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from '@chakra-ui/react';
import { selectedCSS } from 'constants/index';
import useTabIndex from 'components/hook/tab-index';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';
import SBotListing from 'components/bot/sbot/listing';
import TBotListing from 'components/bot/tbot/listing';
import TBotSystemTradeHistoryListing from 'components/bot/tbot-system-trade-history/listing';

const RolePage: NextPage = () => {
  const [tabIndex, setTabIndex, router] = useTabIndex();

  const handleChangeTab = (i: number) => {
    setTabIndex(i);
    router.replace(`/bot#${i}`);
  };

  const ability = useMyAbility();

  if (
    ![
      ability.permissions.GET_BOT,
      ability.permissions.GET_BOT_TRADING,
      ability.permissions.GET_SYSTEM_TRADE_HISTORY,
    ].some((p) => ability.can('ROLE', p))
  )
    return <>{NOT_PERMISSION}</>;

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | PERMISSION</title>
      </Head>
      <Flex flexDirection="column" pt="75px">
        <Tabs
          isLazy
          index={tabIndex}
          variant="enclosed"
          onChange={handleChangeTab}
        >
          <TabList>
            {ability.can('ROLE', ability.permissions.GET_BOT) && (
              <Tab _selected={selectedCSS}>Bot signal</Tab>
            )}
            {ability.can('ROLE', ability.permissions.GET_BOT_TRADING) && (
              <Tab _selected={selectedCSS}>Bot trading</Tab>
            )}
            {ability.can(
              'ROLE',
              ability.permissions.GET_SYSTEM_TRADE_HISTORY,
            ) && <Tab _selected={selectedCSS}>System Trade History</Tab>}
          </TabList>
          <TabPanels>
            {ability.can('ROLE', ability.permissions.GET_BOT) && (
              <TabPanel>
                <SBotListing />
              </TabPanel>
            )}
            {ability.can('ROLE', ability.permissions.GET_BOT_TRADING) && (
              <TabPanel>
                <TBotListing />
              </TabPanel>
            )}
            {ability.can(
              'ROLE',
              ability.permissions.GET_SYSTEM_TRADE_HISTORY,
            ) && (
              <TabPanel>
                <TBotSystemTradeHistoryListing />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default RolePage;
