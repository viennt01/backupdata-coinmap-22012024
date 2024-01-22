import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import RoleListing from 'components/user/role/listing';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from '@chakra-ui/react';
import { selectedCSS } from 'constants/index';
import UserListing from 'components/user/users/listing';
import useTabIndex from 'components/hook/tab-index';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';
import PackageTimeListing from 'components/user/package/listing';

const RolePage: NextPage = () => {
  const [tabIndex, setTabIndex, router] = useTabIndex();

  const handleChangeTab = (i: number) => {
    setTabIndex(i);
    router.replace(`/user#${i}`);
  };

  const ability = useMyAbility();

  if (
    ![ability.permissions.GET_USER, ability.permissions.GET_ROLE].some((p) =>
      ability.can('ROLE', p),
    )
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
            {ability.can('ROLE', ability.permissions.GET_USER) && (
              <Tab _selected={selectedCSS}>User listing</Tab>
            )}
            {ability.can('ROLE', ability.permissions.GET_ROLE) && (
              <Tab _selected={selectedCSS}>User role</Tab>
            )}
            {ability.can('ROLE', ability.permissions.GET_PACKAGE) && (
              <Tab _selected={selectedCSS}>User package</Tab>
            )}
          </TabList>
          <TabPanels>
            {ability.can('ROLE', ability.permissions.GET_USER) && (
              <TabPanel>
                <UserListing />
              </TabPanel>
            )}
            {ability.can('ROLE', ability.permissions.GET_ROLE) && (
              <TabPanel>
                <RoleListing />
              </TabPanel>
            )}
            {ability.can('ROLE', ability.permissions.GET_PACKAGE) && (
              <TabPanel>
                <PackageTimeListing />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default RolePage;
