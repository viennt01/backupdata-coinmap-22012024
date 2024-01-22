import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Divider from '../components/divider';

import styled from '../components/styles.module.scss';
import { Title, Selector } from '../components';
import { SYMBOL } from '@/config/consts/settings/statusline';
// data = [
//   {
//     Title: () => JSX.Element
//     Content: []() => JSX.Element
//   },
// ]

const SYMBOL_OPTIONS = [
  { value: SYMBOL.DESCRIPTION, label: 'Description' },
  { value: SYMBOL.TICKER, label: 'Ticker' },
  { value: SYMBOL.TICKER_AND_DESCRIPTION, label: 'Description & Ticker' },
];

export const DATA_NORMAL = [
  {
    title: () => <Title text="Symbol" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.symbol,
            label: SYMBOL_OPTIONS.find((t) => t.value === settings.symbol)
              .label,
          }}
          options={SYMBOL_OPTIONS}
          key="symbol"
          onChange={handleChangeValue('symbol')}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="Open market status" />,
    content: [
      ({ settings, handleToggle }) => (
        <div key="openMarketStatus" className={styled.tdRightContainer}>
          <Form.Check
            inline
            name="openMarketStatus"
            type={'checkbox'}
            id={`openMarketStatus`}
            checked={settings.openMarketStatus}
            onChange={handleToggle('openMarketStatus')}
            className={[styled.checkboxSettings, styled.formCheckInline].join(
              ' '
            )}
            key="openMarketStatus"
          />
        </div>
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="OHLC values" />,
    content: [
      ({ settings, handleToggle }) => (
        <div key="OHCLValues" className={styled.tdRightContainer}>
          <Form.Check
            inline
            name="OHCLValues"
            type={'checkbox'}
            id={`OHCLValues`}
            checked={settings.OHCLValues}
            onChange={handleToggle('OHCLValues')}
            className={[styled.checkboxSettings, styled.formCheckInline].join(
              ' '
            )}
            key="OHCLValues"
          />
        </div>
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="Bar change values" />,
    content: [
      ({ settings, handleToggle }) => (
        <div key="barChangeValues" className={styled.tdRightContainer}>
          <Form.Check
            inline
            name="barChangeValues"
            type={'checkbox'}
            id={`barChangeValues`}
            checked={settings.barChangeValues}
            onChange={handleToggle('barChangeValues')}
            className={[styled.checkboxSettings, styled.formCheckInline].join(
              ' '
            )}
            key="barChangeValues"
          />
        </div>
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title text="Volume" />,
    content: [
      ({ settings, handleToggle }) => (
        <div key="volume" className={styled.tdRightContainer}>
          <Form.Check
            inline
            name="volume"
            type={'checkbox'}
            id={`volume`}
            checked={settings.volume}
            onChange={handleToggle('volume')}
            className={[styled.checkboxSettings, styled.formCheckInline].join(
              ' '
            )}
            key="volume"
          />
        </div>
      ),
    ],
  },
  {
    type: 'divider',
  },
  {
    title: () => <Title disabled text="Indicator titles" />,
    content: [
      ({ settings, handleToggle }) => (
        <div className={styled.tdRightContainer}>
          <Form.Check
            disabled
            inline
            name="indicatorTitles"
            type={'checkbox'}
            id={`indicatorTitles`}
            checked={settings.indicatorTitles}
            onChange={handleToggle('indicatorTitles')}
            className={[styled.checkboxSettings, styled.formCheckInline].join(
              ' '
            )}
            key="indicatorTitles"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.indicatorTitles}>
        <Form.Check
          disabled
          inline
          name="group1"
          type={'checkbox'}
          id={`indicatorValue`}
          checked={settings.indicatorValue}
          onChange={handleToggle('indicatorValue')}
          className={styled.checkboxSettings}
          key="indicatorValue"
        />
        <Title disabled text="Indicator values" />
      </div>
    ),
    content: [],
  },
];

export default function Content({ setSettings, settings }) {
  const handleChangeColor = (key, value) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = value;
    }
    setSettings({ ...settings });
  };

  const handleToggle = (key) => (e) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = e.target.checked;
    }
    setSettings({ ...settings });
  };

  const handleChangeValue = (key) => (value) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = value;
    }
    setSettings({ ...settings });
  };

  return (
    <div className={styled.viewSettingsContainer}>
      <Table
        id="table-settings-view"
        className={styled.tableSettings}
        responsive
        borderless
      >
        <tbody>
          {DATA_NORMAL.map((d, i) => {
            if (d.type === 'divider') {
              return (
                <tr key={i}>
                  <td colSpan={2}>
                    <Divider />
                  </td>
                </tr>
              );
            }
            return (
              <tr key={i}>
                <td width="40%">
                  {d.title({
                    settings,
                    handleChangeColor,
                    handleToggle,
                    handleChangeValue,
                  })}
                </td>
                <td>
                  <div className={styled.contentSettingsContainer}>
                    {d.content.map((c) => {
                      return c({
                        settings,
                        handleChangeColor,
                        handleToggle,
                        handleChangeValue,
                      });
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}
