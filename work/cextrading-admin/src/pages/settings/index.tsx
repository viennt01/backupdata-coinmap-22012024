import type { NextPage } from 'next';
import React from 'react';
import Head from 'next/head';
import GeneralListing from 'components/settings/general/listing';
import FeatureListing from 'components/settings/feature/listing';
import ResolutionListing from 'components/settings/resolution/listing';
import SymbolListing from 'components/settings/symbol/listing';
import ExchangeListing from 'components/settings/exchange/listing';

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
import { AbilityContext } from 'context/casl';
import { useAbility } from '@casl/react';
import { PERMISSION_LIST } from 'constants/permission-id';
import CextradingSetting from 'components/settings/cextrading';
import BotListing from 'components/settings/bot/listing';
import CurrencyListing from 'components/settings/currency/listing';

const SettingsPage: NextPage = () => {
  const [tabIndex, setTabIndex, router] = useTabIndex();
  const ability = useAbility(AbilityContext);

  const handleChangeTab = (i: number) => {
    setTabIndex(i);
    router.replace(`/settings#${i}`);
  };

  if (
    ![
      PERMISSION_LIST.GET_EXCHANGE,
      PERMISSION_LIST.GET_FEATURE,
      PERMISSION_LIST.GET_GENERAL_SETTING,
      PERMISSION_LIST.GET_RESOLUTION,
      PERMISSION_LIST.GET_SYMBOL,
      PERMISSION_LIST.ON_OFF_REGISTER,
    ].some((p) => ability.can('ROLE', p))
  )
    return null;

  return (
    <>
      <Head>
        <title>COINMAP ADMIN | SETTINGS</title>
      </Head>
      <Flex flexDirection="column" pt="75px">
        <Tabs
          isLazy
          index={tabIndex}
          variant="enclosed"
          onChange={handleChangeTab}
        >
          <TabList>
            {ability.can('ROLE', PERMISSION_LIST.GET_GENERAL_SETTING) && (
              <Tab _selected={selectedCSS}>General</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_FEATURE) && (
              <Tab _selected={selectedCSS}>Feature</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_EXCHANGE) && (
              <Tab _selected={selectedCSS}>Exchange</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_SYMBOL) && (
              <Tab _selected={selectedCSS}>Symbol</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_RESOLUTION) && (
              <Tab _selected={selectedCSS}>Resolution</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.ON_OFF_REGISTER) && (
              <Tab _selected={selectedCSS}>Cextrading</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_BOT_SETTING) && (
              <Tab _selected={selectedCSS}>Bot</Tab>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_CURRENCY) && (
              <Tab _selected={selectedCSS}>Currency</Tab>
            )}
          </TabList>
          <TabPanels>
            {ability.can('ROLE', PERMISSION_LIST.GET_GENERAL_SETTING) && (
              <TabPanel>
                <GeneralListing />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_FEATURE) && (
              <TabPanel>
                <FeatureListing />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_EXCHANGE) && (
              <TabPanel>
                <ExchangeListing />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_SYMBOL) && (
              <TabPanel>
                <SymbolListing />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_RESOLUTION) && (
              <TabPanel>
                <ResolutionListing />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.ON_OFF_REGISTER) && (
              <TabPanel>
                <CextradingSetting />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_BOT_SETTING) && (
              <TabPanel>
                <BotListing />
              </TabPanel>
            )}
            {ability.can('ROLE', PERMISSION_LIST.GET_CURRENCY) && (
              <TabPanel>
                <CurrencyListing />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

export default SettingsPage;
