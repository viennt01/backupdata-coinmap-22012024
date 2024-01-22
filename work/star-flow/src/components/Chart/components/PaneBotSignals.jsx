import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Button } from 'react-bootstrap';

import Loading from '@/components/Loading';
import { actFetchBotSignals, actUpdateBotSignals } from '@/redux/actions/data';

import style from './PaneBotSignals.module.scss';
import { timeFormat } from 'd3-time-format';
import { SVGChervletDown, SVGChervletUp } from '@/assets/images/svg';
import BackTestResultModal from './BackTestResultModal';

const defaultOptions = {
  type: 'violencypinbar',
};

const NumberInput = ({ label, fieldName, value, onChange }) => {
  return (
    <div className="form-group col-6">
      <label>{label}</label>
      <input
        name={fieldName}
        onChange={onChange}
        type="number"
        className="form-control form-control-sm"
        value={value}
      />
    </div>
  );
};

const DatePicker = ({ label, fieldName, value, onChange }) => {
  const valueStr = useMemo(() => {
    let dateValue = value;
    if (typeof value === 'string') {
      dateValue = new Date(value);
    }

    return dateValue.toISOString().slice(0, 16);
  }, [value]);

  const handleChange = useCallback(
    (e) => {
      onChange({
        target: {
          value: new Date(e.target.value),
          name: e.target.name,
        },
      });
    },
    [onChange]
  );

  return (
    <div className="form-group col-6">
      <label>{label}</label>
      <input
        name={fieldName}
        onChange={handleChange}
        type="datetime-local"
        className="form-control form-control-sm"
        value={valueStr}
      />
    </div>
  );
};

const CheckBox = ({ label, fieldName, value, onChange }) => {
  const handleChange = useCallback(
    (e) => {
      onChange({
        target: {
          name: fieldName,
          value: e.target.checked,
        },
      });
    },
    [onChange]
  );
  const id = `bot_option_${fieldName}`;

  return (
    <div className="form-group col-6">
      <label htmlFor={id}>{label}</label>
      <div>
        <input
          id={id}
          name={fieldName}
          onChange={handleChange}
          type="checkbox"
          className="form-control form-control-sm form-check-input"
          checked={value}
        />
      </div>
    </div>
  );
};

const SelectBox = ({ field, label, fieldName, value, onChange }) => {
  const handleChange = useCallback(
    (e) => {
      onChange({
        target: {
          name: fieldName,
          value: e.target.value,
        },
      });
    },
    [onChange, fieldName]
  );
  const id = `bot_option_${fieldName}`;

  return (
    <div className="form-group col-6">
      <label htmlFor={id}>{label}</label>
      <div>
        <select
          name={fieldName}
          className="form-control form-control-sm"
          id={id}
          onChange={handleChange}
        >
          {(field.default ?? []).map((item) => (
            <option
              value={item.value}
              key={item.value}
              selected={value === item.value}
            >
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

const formControlTypeMapper = {
  date: DatePicker,
  number: NumberInput,
  boolean: CheckBox,
  array: SelectBox,
};

const getValueType = (value) => {
  let valueType = typeof value;
  if (valueType === 'object' && value instanceof Date) {
    valueType = 'date';
  }

  return valueType;
};

const renderFormField = (fieldName, field, value, onChange) => {
  const valueType = field.type ?? getValueType(field.default);
  const FieldComponent = formControlTypeMapper[valueType];
  if (!FieldComponent) {
    return null;
  }

  return (
    <FieldComponent
      key={fieldName}
      label={field.name}
      value={value}
      onChange={onChange}
      fieldName={fieldName}
      field={field}
    />
  );
};

const formarter = timeFormat('%Y-%m-%d %H:%M');

const SignalItem = ({ item, onClick }) => {
  const [showResult, setShowResult] = useState(false);

  const resultDetails = useMemo(() => {
    if (typeof item.orderResult !== 'object') {
      return null;
    }

    return (
      <div className={style.resultItem}>
        {Object.keys(item.orderResult).map((key) => (
          <div key={key}>
            {key}: {item.orderResult[key]}
          </div>
        ))}
      </div>
    );
  }, [item?.orderResult]);

  return (
    <div className={style.item}>
      <span role="button" onClick={() => onClick(item.t)}>
        {formarter(new Date(item.t))} -{' '}
        <span style={{ color: item.type }}>{item.type}</span>
        {item?.orderResult?.status ? ` - ${item?.orderResult?.status}` : ''}
      </span>{' '}
      {item?.orderResult && (
        <Button
          onClick={() => {
            setShowResult(!showResult);
          }}
          size="sm"
          type="button"
          variant="link"
        >
          {showResult && <SVGChervletUp />}
          {!showResult && <SVGChervletDown />}
        </Button>
      )}
      {item?.orderResult && showResult ? resultDetails : null}
    </div>
  );
};

const OptionSection = ({ update, options, botMap }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tmpOptions, setTmpOptions] = useState(options || defaultOptions);
  useEffect(() => {
    setTmpOptions({ ...defaultOptions, ...options });
  }, [options]);

  const fields = botMap[tmpOptions.type]?.params;

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      update(tmpOptions);
    },
    [update, tmpOptions]
  );

  const onChange = useCallback(
    (e) => {
      let value = e.target.value;
      const field = e.target.name;

      setTmpOptions({
        ...tmpOptions,
        [field]: value,
      });
    },
    [setTmpOptions, tmpOptions]
  );

  const typeOption = useMemo(
    () => (
      <div className="form-group col-6">
        <select
          name="type"
          className="form-control form-control-sm"
          onChange={onChange}
          value={tmpOptions.type}
        >
          {Object.keys(botMap).map((botType) => {
            const name = botMap[botType].name;

            return (
              <option key={botType} value={botType}>
                {name}
              </option>
            );
          })}
        </select>
      </div>
    ),
    [tmpOptions.type, onChange]
  );

  const formControls = useMemo(() => {
    return Object.keys(fields).map((fieldName) => {
      const field = fields[fieldName];
      const value =
        typeof tmpOptions[fieldName] !== 'undefined'
          ? tmpOptions[fieldName]
          : field.default;
      return renderFormField(fieldName, field, value, onChange);
    });
  }, [fields, tmpOptions, onChange]);

  if (!isOpen) {
    return (
      <div className={`container gx-2 ${style.optionSection}`}>
        <div className="row gx-2">
          {typeOption}
          <div className="form-group col-6">
            <button
              className={style.toggleOptionsButton}
              onClick={() => setIsOpen(true)}
            >
              <SVGChervletDown /> Options
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container gx-2 ${style.optionSection}`}>
      <form onSubmit={handleSubmit}>
        <div className="row gx-2">
          {typeOption}
          <div className="form-group col-6">
            <button
              className={style.toggleOptionsButton}
              onClick={() => setIsOpen(false)}
            >
              <SVGChervletUp /> Options
            </button>
          </div>
          {formControls}
          <div className="form-group col-12 pt-2">
            <button type="submit" className={style.searchButton}>
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const PaneBotSignals = memo(({ botMap, chartId, onJump, symbol, interval }) => {
  const defaultBotId = useMemo(() => {
    return Object.keys(botMap)[0];
  }, [botMap]);
  const [showBackTestResult, setShowBackTestResult] = useState(false);

  const { signalsMap } = useSelector((state) => {
    const chartData = state.chartData.charts[chartId];

    return {
      signalsMap: chartData?.botSignals?.signalsMap ?? null,
    };
  }, shallowEqual);
  const reduxOptions = useSelector(
    (state) =>
      state.chartSettings.charts[chartId]?.botSignalOptions || defaultOptions
  );
  const options = {
    ...defaultOptions,
    ...reduxOptions,
  };
  if (!botMap[options.type]) {
    options.type = defaultBotId;
  }
  const dispatch = useDispatch();
  const [selectedBot, setSelectedBot] = useState(options.type);

  // Search and update options to redux
  const handleSearch = useCallback(
    (newOptions) => {
      const fields = botMap[newOptions.type].params;
      const fieldNames = Object.keys(fields);
      const defaultValues = {};
      fieldNames.forEach((fieldName) => {
        if (Array.isArray(fields[fieldName].default)) {
          defaultValues[fieldName] = fields[fieldName].default[0]?.value;
          return;
        }
        defaultValues[fieldName] = fields[fieldName].default;
      });
      // Remove invalid fields
      const validKeys = [
        'chartId',
        'interval',
        'symbol',
        'type',
        ...fieldNames,
      ];
      Object.keys(newOptions).forEach((key) => {
        if (!validKeys.includes(key)) {
          delete newOptions[key];
        }
      });

      const finalOptions = {
        ...defaultValues,
        ...newOptions,
      };

      dispatch(actUpdateBotSignals(chartId, null, finalOptions));
      dispatch(actFetchBotSignals(finalOptions));
    },
    [dispatch, chartId]
  );

  // Load first time data on did mount if no data
  useEffect(() => {
    const newOptions = {
      ...options,
      chartId,
      symbol,
      interval,
    };
    handleSearch(newOptions);
  }, [dispatch, symbol, interval, chartId, handleSearch]); // no signalsMap, options

  let list = <Loading iconProps={{ with: 50, height: 50 }} />;
  if (signalsMap !== null) {
    const keys = Object.keys(signalsMap);
    if (keys.length > 0) {
      list = keys.map((time) => {
        const item = signalsMap[time];
        return <SignalItem key={time} item={item} onClick={onJump} />;
      });
    } else {
      list = (
        <div className={style.noSignalFound}>
          <h3>No signal found</h3>
        </div>
      );
    }
  }

  return (
    <>
      <OptionSection
        selectedBot={selectedBot}
        setSelectedBot={setSelectedBot}
        update={handleSearch}
        options={options}
        botMap={botMap}
      />
      <Button
        variant="secondary"
        onClick={() => setShowBackTestResult(true)}
        size="sm"
        className={style.btnShowBackTest}
      >
        Show backtest result
      </Button>
      <BackTestResultModal
        show={showBackTestResult}
        chartId={chartId}
        botName={selectedBot}
        onHide={() => setShowBackTestResult(false)}
      />
      {list}
    </>
  );
});

PaneBotSignals.displayName = 'PaneBotSignals';

export default PaneBotSignals;
