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
import TransactionListing from 'components/trans-v2/listing';

const TransactionPage: NextPage = () => {
  const [tabIndex, setTabIndex, router] = useTabIndex();

  const handleChangeTab = (i: number) => {
    setTabIndex(i);
    router.replace(`/transaction#${i}`);
  };

  const ability = useMyAbility();

  if (
    ![ability.permissions.GET_TRANSACTION].some((p) => ability.can('ROLE', p))
  )
    return <>{NOT_PERMISSION}</>;

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | TRANSACTION</title>
      </Head>
      <Flex flexDirection="column" pt="75px">
        <Tabs
          isLazy
          index={tabIndex}
          variant="enclosed"
          onChange={handleChangeTab}
        >
          <TabList>
            {ability.can('ROLE', ability.permissions.GET_TRANSACTION) && (
              <Tab _selected={selectedCSS}>Transaction</Tab>
            )}
          </TabList>
          <TabPanels>
            {ability.can('ROLE', ability.permissions.GET_TRANSACTION) && (
              <TabPanel>
                <TransactionListing />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default TransactionPage;
