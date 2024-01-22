import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Divider from '../components/divider';

import styled from '../components/styles.module.scss';
import { ColorSection } from '../../components/index';
import { Title, Selector } from '../components';
import SelectLines, { LINES_OPTIONS } from '../components/select-line';

import {
  FONT_SIZE,
  FONT_FAMILY,
  PRECISION,
} from '@/config/consts/settings/pricescale';
// data = [
//   {
//     Title: () => JSX.Element
//     Content: []() => JSX.Element
//   },
// ]

const FONT_OPTIONS = [
  { value: FONT_FAMILY.IONICONS, label: 'Ionicons' },
  { value: FONT_FAMILY.ROBOTO, label: 'Roboto' },
];

const PRECISION_OPTIONS = [
  { value: PRECISION.DEFAULT, label: 'Default' },
  { value: PRECISION[1], label: '1' },
  { value: PRECISION[2], label: '2' },
  { value: PRECISION[3], label: '3' },
  { value: PRECISION[4], label: '4' },
  { value: PRECISION[5], label: '5' },
  { value: PRECISION[6], label: '6' },
];

const FONT_SIZE_OPTIONS = [
  { value: FONT_SIZE[8], label: '8' },
  { value: FONT_SIZE[9], label: '9' },
  { value: FONT_SIZE[10], label: '10' },
  { value: FONT_SIZE[11], label: '11' },
  { value: FONT_SIZE[12], label: '12' },
];

const WIDTH_OPTIONS = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
];

export const DATA_NORMAL = [
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Form.Check
          inline
          name="countdown"
          type={'checkbox'}
          label="Countdown to bar close"
          id={`countdown`}
          checked={settings.countdown}
          onChange={handleToggle('countdown')}
          className={styled.checkboxSettings}
          key="countdown"
        />
      </div>
    ),
    content: [],
  },
  {
    title: () => <Title text="Precision" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.precision,
            label: PRECISION_OPTIONS.find((t) => t.value === settings.precision)
              .label,
          }}
          options={PRECISION_OPTIONS}
          key="precision"
          onChange={handleChangeValue('precision')}
        />
      ),
    ],
  },
  {
    type: 'divider',
  },

  {
    title: () => <Title text="APPEARANCE" />,
    content: [],
  },
  {
    title: () => <Title text="Font" />,
    content: [
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.font.fontFamily,
            label: FONT_OPTIONS.find(
              (t) => t.value === settings.font.fontFamily
            ).label,
          }}
          options={FONT_OPTIONS}
          key="font.fontFamily"
          onChange={handleChangeValue('font.fontFamily')}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <Selector
          isSearchable={false}
          value={{
            value: settings.font.fontSize,
            label: FONT_SIZE_OPTIONS.find(
              (t) => t.value === settings.font.fontSize
            ).label,
          }}
          options={FONT_SIZE_OPTIONS}
          key="font.fontSize"
          onChange={handleChangeValue('font.fontSize')}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div className="w-auto">
          <button
            className={[
              styled.buttonBold,
              settings.font.bold ? styled.active : '',
            ].join(' ')}
            onClick={() => handleChangeValue('font.bold')(!settings.font.bold)}
          >
            B
          </button>
        </div>
      ),
    ],
  },
  {
    title: () => <Title text="Font color" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <div key="fontColor">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="fontColor"
            color={settings.fontColor}
            key="fontColor"
          />
        </div>
      ),
      () => <div key="font-color-1" className=""></div>,
      () => <div key="font-color-2" className=""></div>,
    ],
  },
  {
    title: () => <Title text="Axis" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <div key="axis">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="axis"
            color={settings.axis}
            key="axis"
          />
        </div>
      ),
      () => <div key="font-color-1" className=""></div>,
      () => <div key="font-color-2" className=""></div>,
    ],
  },
  {
    title: () => <Title text="Axis background" />,
    content: [
      ({ settings, handleChangeColor }) => (
        <div key="axisBackground">
          <ColorSection
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="axisBackground"
            color={settings.axisBackground}
            key="axisBackground"
          />
        </div>
      ),
      () => <div key="font-color-1" className=""></div>,
      () => <div key="font-color-2" className=""></div>,
    ],
  },
  {
    type: 'divider',
  },

  {
    title: () => <Title text="HIGHLIGHT PRICES" />,
    content: [],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title disabled text="Ask Marker" />
        <Form.Check
          disabled
          inline
          name="askMarker.display"
          type={'checkbox'}
          id={`askMarker.display`}
          checked={settings.askMarker.display}
          onChange={handleToggle('askMarker.display')}
          className={styled.checkboxSettings}
          key="askMarker.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          disabled
          line={{
            value: settings.askMarker.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.askMarker.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('askMarker.type')(line.value);
          }}
          key={'askMarker.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div key="askMarker.width" style={{ minWidth: 60 }} className="w-auto">
          <Selector
            disabled
            isSearchable={false}
            value={{
              value: settings.askMarker.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.askMarker.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="askMarker.width"
            onChange={handleChangeValue('askMarker.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="askMarker.color" className="w-auto">
          <ColorSection
            disabled
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="askMarker.color"
            color={settings.askMarker.color}
            key="askMarker.color"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title disabled text="Last Price Marker" />
        <Form.Check
          disabled
          inline
          name="lastPriceMarker.display"
          type={'checkbox'}
          id={`lastPriceMarker.display`}
          checked={settings.lastPriceMarker.display}
          onChange={handleToggle('lastPriceMarker.display')}
          className={styled.checkboxSettings}
          key="lastPriceMarker.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          disabled
          line={{
            value: settings.lastPriceMarker.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.lastPriceMarker.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('lastPriceMarker.type')(line.value);
          }}
          key={'lastPriceMarker.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="lastPriceMarker.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            disabled
            isSearchable={false}
            value={{
              value: settings.lastPriceMarker.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.lastPriceMarker.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="lastPriceMarker.width"
            onChange={handleChangeValue('lastPriceMarker.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="lastPriceMarker.color" className="w-auto">
          <ColorSection
            disabled
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="lastPriceMarker.color"
            color={settings.lastPriceMarker.color}
            key="lastPriceMarker.color"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title disabled text="Previous Day Close" />
        <Form.Check
          disabled
          inline
          name="previousDayClose.display"
          type={'checkbox'}
          id={`previousDayClose.display`}
          checked={settings.previousDayClose.display}
          onChange={handleToggle('previousDayClose.display')}
          className={styled.checkboxSettings}
          key="previousDayClose.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          disabled
          line={{
            value: settings.previousDayClose.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.previousDayClose.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('previousDayClose.type')(line.value);
          }}
          key={'previousDayClose.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div
          key="previousDayClose.width"
          style={{ minWidth: 60 }}
          className="w-auto"
        >
          <Selector
            disabled
            isSearchable={false}
            value={{
              value: settings.previousDayClose.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.previousDayClose.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="previousDayClose.width"
            onChange={handleChangeValue('previousDayClose.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="previousDayClose.color" className="w-auto">
          <ColorSection
            disabled
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="previousDayClose.color"
            color={settings.previousDayClose.color}
            key="previousDayClose.color"
          />
        </div>
      ),
    ],
  },
  {
    title: ({ settings, handleToggle }) => (
      <div className={styled.tdLeftContainer}>
        <Title disabled text="Day High/Low" />
        <Form.Check
          disabled
          inline
          name="dayHighLow.display"
          type={'checkbox'}
          id={`dayHighLow.display`}
          checked={settings.dayHighLow.display}
          onChange={handleToggle('dayHighLow.display')}
          className={styled.checkboxSettings}
          key="dayHighLow.display"
        />
      </div>
    ),
    content: [
      ({ settings, handleChangeValue }) => (
        <SelectLines
          disabled
          line={{
            value: settings.dayHighLow.type,
            label: LINES_OPTIONS.find(
              (t) => t.value === settings.dayHighLow.type
            ).label,
          }}
          selectLine={(line) => {
            handleChangeValue('dayHighLow.type')(line.value);
          }}
          key={'dayHighLow.type'}
        />
      ),
      ({ settings, handleChangeValue }) => (
        <div key="dayHighLow.width" style={{ minWidth: 60 }} className="w-auto">
          <Selector
            disabled
            isSearchable={false}
            value={{
              value: settings.dayHighLow.width,
              label: WIDTH_OPTIONS.find(
                (t) => t.value === Number(settings.dayHighLow.width)
              ).label,
            }}
            options={WIDTH_OPTIONS}
            key="dayHighLow.width"
            onChange={handleChangeValue('dayHighLow.width')}
          />
        </div>
      ),
      ({ settings, handleChangeColor }) => (
        <div key="dayHighLow.color" className="w-auto">
          <ColorSection
            disabled
            handleChangeColor={handleChangeColor}
            label=""
            keyColor="dayHighLow.color"
            color={settings.dayHighLow.color}
            key="dayHighLow.color"
          />
        </div>
      ),
    ],
  },
];

export default function Content({ setSettings, settings }) {
  const handleChangeColor = (key, value) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = value;
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = value;
    }
    if (keys.length === 3) {
      settings[keys[0]][keys[1]][keys[2]] = value;
    }
    setSettings({ ...settings });
  };

  const handleToggle = (key) => (e) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = e.target.checked;
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = e.target.checked;
    }
    if (keys.length === 3) {
      settings[keys[0]][keys[1]][keys[2]] = e.target.checked;
    }
    setSettings({ ...settings });
  };

  const handleChangeValue = (key) => (value) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      settings[keys[0]] = value;
    }
    if (keys.length === 2) {
      settings[keys[0]][keys[1]] = value;
    }

    if (keys.length === 3) {
      settings[keys[0]][keys[1]][keys[2]] = value;
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
