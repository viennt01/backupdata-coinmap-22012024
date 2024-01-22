import { SVGFilter, SVGSettingFill } from '@/assets/images/svg';
import { Button, Popover, Space } from 'antd';
import { useContext } from 'react';
import { useCallback, useMemo, useState } from 'react';
import FormFilter from './FormFilter';
import SignalSetting from './Setting';
import { FilterContext, TAB_MAP } from './SignalTabs';

import style from './SignalTabs.module.scss';

export const checkFilterActive = (filterValues) => {
  return Object.keys(filterValues).some((key) => {
    if (typeof filterValues[key] === 'object') {
      return filterValues[key]?.length > 0;
    }

    return typeof filterValues[key] !== 'undefined';
  });
};

const TabActions = () => {
  const currentFilter = useContext(FilterContext);
  const [openFilter, setOpenFilter] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  const toggleFilter = useCallback((isOpen) => setOpenFilter(isOpen), []);
  const toggleSettings = useCallback((isOpen) => setOpenSettings(isOpen), []);

  const filterValues = useMemo(
    () =>
      currentFilter.activeTabKey === TAB_MAP.all.key
        ? currentFilter.allFilter
        : currentFilter.favoriteFilter,
    [
      currentFilter.activeTabKey,
      currentFilter.allFilter,
      currentFilter.favoriteFilter,
    ]
  );

  const actions = useMemo(() => {
    const isFilterActive = openFilter || checkFilterActive(filterValues);

    return (
      <Space size="small">
        <Popover
          placement="bottomRight"
          trigger="click"
          open={openFilter}
          onOpenChange={toggleFilter}
          content={
            <FormFilter
              filterValues={filterValues}
              togglePopover={toggleFilter}
              openFilter={openFilter}
            />
          }
        >
          <Button
            type="ghost"
            size="small"
            className={isFilterActive ? style.activedPopover : ''}
          >
            <SVGFilter />
          </Button>
        </Popover>
        <Popover
          placement="bottomRight"
          trigger="click"
          content={<SignalSetting />}
          open={openSettings}
          onOpenChange={toggleSettings}
        >
          <Button
            type="ghost"
            size="small"
            className={openSettings ? style.activedPopover : ''}
          >
            <SVGSettingFill />
          </Button>
        </Popover>
      </Space>
    );
  }, [openFilter, toggleFilter, openSettings, toggleSettings, filterValues]);

  return actions;
};

export default TabActions;
