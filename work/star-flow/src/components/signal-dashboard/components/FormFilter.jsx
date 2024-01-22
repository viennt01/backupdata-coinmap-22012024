import { SvgArrowRightLong } from '@/assets/images/svg/page';
import { candleIntervalsMap } from '@/config/consts/interval';
import { fetchListPairs } from '@/redux/actions';
import { Button, Checkbox, DatePicker, Form, Select, Space } from 'antd';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from './FormFilter.module.scss';
import { defaultContextValues, FilterContext, TAB_MAP } from './SignalTabs';

const INTERVAL_OPTIONS = Object.keys(candleIntervalsMap).map((key) => ({
  value: candleIntervalsMap[key],
  label: candleIntervalsMap[key],
}));

const FormFilter = ({ togglePopover, filterValues, openFilter }) => {
  const currentFilter = useContext(FilterContext);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const pairs = useSelector((state) => state.common.pairs);

  const { loadingSymbol, symbolOptions } = useMemo(() => {
    if (!pairs?.length) {
      return { loadingSymbol: true, symbolOptions: [] };
    }

    const symbolOptions = pairs.map((pair) => ({
      label: `${pair.symbol} - ${pair.exchange}`,
      value: `${pair.symbol}_${pair.exchange}`,
      pair,
    }));

    return {
      symbolOptions,
      loadingSymbol: false,
    };
  }, [pairs]);

  useEffect(() => {
    dispatch(fetchListPairs(50));
  }, []);

  const filterValueKey =
    currentFilter.activeTabKey === TAB_MAP.all.key
      ? 'allFilter'
      : 'favoriteFilter';

  const handleFilter = useCallback(
    (values) => {
      currentFilter.setValues((currentData) => {
        return {
          ...currentData,
          [filterValueKey]: values,
        };
      });
      togglePopover(false);
    },
    [currentFilter, togglePopover]
  );

  const handleClearFilter = useCallback(() => {
    const newFilter = {
      ...currentFilter,
      [filterValueKey]: defaultContextValues[filterValueKey],
    };
    currentFilter.setValues(newFilter);
    togglePopover(false);
  }, [currentFilter, togglePopover, filterValueKey]);

  useEffect(() => {
    form.setFieldsValue(filterValues);
  }, [filterValues, form, openFilter]);

  return (
    <div className={style.filter}>
      <Form
        form={form}
        layout="vertical"
        colon={false}
        size="large"
        onFinish={handleFilter}
      >
        <div className={style.formTitle}>Filter signals</div>
        <Form.Item name="symbols" label="Symbol">
          <Select
            showSearch
            allowClear
            placeholder="Select symbol"
            mode="multiple"
            loading={loadingSymbol}
            options={symbolOptions}
            maxTagCount="responsive"
          />
        </Form.Item>
        <Form.Item name="resolutions" label="Timeframe">
          <Select
            showSearch
            allowClear
            mode="multiple"
            placeholder="Select timeframe"
            options={INTERVAL_OPTIONS}
            maxTagCount="responsive"
          />
        </Form.Item>
        <Form.Item name="period" label="Period">
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="botTypes" label="Bot type">
          <Select
            showSearch
            allowClear
            mode="multiple"
            placeholder="Select bot type"
            options={currentFilter.bots}
            maxTagCount="responsive"
          />
        </Form.Item>
        <Form.Item name="signal" label="Signal">
          <Checkbox.Group>
            <Space size="large">
              <Checkbox value="BUY">Buy</Checkbox>
              <Checkbox value="SELL">Sell</Checkbox>
            </Space>
          </Checkbox.Group>
        </Form.Item>
        <div className={style.actions}>
          <Button
            className={style.resetBtn}
            type="text"
            htmlType="button"
            size="large"
            onClick={handleClearFilter}
          >
            Clear filter
          </Button>
          <Button type="primary" htmlType="submit" size="large">
            APPLY <SvgArrowRightLong />
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormFilter;
