import React from 'react';
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Box,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { selectedCSS } from 'constants/index';
import useTabIndex from 'components/hook/tab-index';
import ListSBot from 'components/user/users/list-history-sbot';
import ListTBot from 'components/user/users/list-history-tbot';
import ListPkg from 'components/user/users/list-history-pkg';

export default function HistoryTransaction() {
  const [tabIndex, setTabIndex] = useTabIndex();

  const handleChangeTab = (i: number) => {
    setTabIndex(i);
  };

  const bg = useColorModeValue('white', 'gray.700');

  return (
    <>
      <Box bg={bg} p="20px" borderRadius={15}>
        <Heading mb={'20px'} textAlign="center" size="xl">
          TRANSACTION HISTORY
        </Heading>
        <Flex flexDirection="column">
          <Tabs
            isLazy
            index={tabIndex}
            variant="enclosed"
            onChange={handleChangeTab}
          >
            <TabList>
              <Tab _selected={selectedCSS}>ROLE</Tab>
              <Tab _selected={selectedCSS}>BOT SIGNAL</Tab>
              <Tab _selected={selectedCSS}>BOT TRADING</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <ListPkg />
              </TabPanel>
              <TabPanel>
                <ListSBot />
              </TabPanel>
              <TabPanel>
                <ListTBot />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Flex>
      </Box>
    </>
  );
}
