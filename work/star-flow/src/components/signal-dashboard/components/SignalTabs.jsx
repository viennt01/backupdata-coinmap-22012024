import { APP_PAGES } from '@/config/consts/uris';
import BotService from '@/fetcher/services/bot.service';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SignalsTable from './SignalsTable';

import TabActions from './TabActions';

export const defaultContextValues = {
  allFilter: {
    symbols: [],
    resolutions: [],
    period: null,
    botTypes: [],
    signal: null,
  },
  favoriteFilter: {
    symbols: [],
    resolutions: [],
    period: null,
    botTypes: [],
    signal: null,
  },
  bots: [],
  setValues: (values) => values,
  activeTabKey: 'all',
};
export const FilterContext = React.createContext(defaultContextValues);

/** @type {{[key: string]: import('antd').TabPaneProps}} */
export const TAB_MAP = {
  all: {
    label: `All singal`,
    key: 'all',
    children: <SignalsTable />,
    uri: APP_PAGES.SIGNAL_DASHBOARD.uri,
  },
  favorite: {
    label: `Favorite signal`,
    key: 'favorite',
    children: <SignalsTable isFavorite />,
    uri: APP_PAGES.SIGNAL_DASHBOARD_FAVORITE.uri,
  },
};

const TABS = Object.values(TAB_MAP);

/* -------------------------------------------------------------------------- */
const SignalTabs = () => {
  // Active key base on path
  const router = useRouter();
  let path = router.query?.path ?? 'all';
  const activeKey = useMemo(() => {
    let key = path;
    if (!TAB_MAP[key]) {
      key = 'all';
    }

    return key;
  }, [path]);

  const [currentFilter, setCurrentFilter] = useState({
    ...defaultContextValues,
    activeTabKey: activeKey,
  });

  // load list paid bots and transform to supported select option
  const loadPaidBots = useCallback(async () => {
    try {
      const res = await BotService.getPaidBotList();

      if (!Array.isArray(res.payload)) {
        return;
      }

      // Support using item as select option
      const bots = res.payload.map((bot) => ({
        ...bot,
        label: bot.name,
        value: bot.id,
      }));

      setCurrentFilter((current) => ({
        ...current,
        bots,
      }));
    } catch (error) {
      console.log('Can not get list paid bots', error);
    }
  }, []);

  useEffect(() => {
    currentFilter.setValues = setCurrentFilter;
    loadPaidBots();
  }, []);

  const handleChangeTab = useCallback(
    (key) => {
      if (activeKey === key) {
        return;
      }

      const uri = TAB_MAP[key]?.uri;
      if (!uri) {
        return;
      }

      setCurrentFilter((data) => ({ ...data, activeTabKey: key }));
      router.push(uri, undefined, { shallow: true });
    },
    [activeKey, router]
  );

  return (
    <FilterContext.Provider value={currentFilter}>
      <Tabs
        activeKey={activeKey}
        onChange={handleChangeTab}
        items={TABS}
        tabBarExtraContent={<TabActions />}
      />
    </FilterContext.Provider>
  );
};

export default SignalTabs;
