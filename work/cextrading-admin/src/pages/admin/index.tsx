// Chakra imports
import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';
// Custom components

import React from 'react';
import Head from 'next/head';
import { selectedCSS } from 'constants/index';
import AdminListing from 'components/admin/listing';
import AdminRoleListing from 'components/admin/role/listing';
import useTabIndex from 'components/hook/tab-index';
import { NOT_PERMISSION } from 'constants/message';
import useMyAbility from 'hook/ability';

const AdminPage = () => {
  const [tabIndex, setTabIndex, router] = useTabIndex();
  const ability = useMyAbility();

  const handleChangeTab = (i: number) => {
    setTabIndex(i);
    router.replace(`/admin#${i}`);
  };

  if (
    ![ability.permissions.GET_AUTH_ROLE, ability.permissions.GET_ADMIN].some(
      (p) => ability.can('ROLE', p),
    )
  )
    return <>{NOT_PERMISSION}</>;

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | DASHBOARD</title>
      </Head>

      <Flex flexDirection="column" pt={{ base: '120px', md: '75px' }}>
        <Tabs
          isLazy
          index={tabIndex}
          variant="enclosed"
          onChange={handleChangeTab}
        >
          <TabList>
            {ability.can('ROLE', ability.permissions.GET_ADMIN) && (
              <Tab _selected={selectedCSS}>Admin</Tab>
            )}
            {ability.can('ROLE', ability.permissions.GET_AUTH_ROLE) && (
              <Tab _selected={selectedCSS}>Admin role</Tab>
            )}
          </TabList>
          <TabPanels>
            {ability.can('ROLE', ability.permissions.GET_ADMIN) && (
              <TabPanel>
                <AdminListing />
              </TabPanel>
            )}
            {ability.can('ROLE', ability.permissions.GET_AUTH_ROLE) && (
              <TabPanel>
                <AdminRoleListing />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default AdminPage;
